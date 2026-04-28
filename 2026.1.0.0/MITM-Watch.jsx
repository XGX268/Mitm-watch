import { useState, useEffect, useRef } from “react”;

const BROWSERS = [
“Chrome (Windows)”, “Chrome (macOS)”, “Chrome (Linux)”, “Chrome (Android)”, “Chrome (iOS)”,
“Firefox (Windows)”, “Firefox (macOS)”, “Firefox (Linux)”, “Firefox (Android)”,
“Safari (macOS)”, “Safari (iOS)”,
“Edge (Windows)”, “Edge (macOS)”,
“Brave (Windows)”, “Brave (macOS)”, “Brave (Linux)”,
“Opera (Windows)”, “Opera (macOS)”,
“Samsung Internet (Android)”,
“Other”
];

const SCREENSHOT_TYPES = [“Homepage”, “Error Page”, “Login Page”, “Redirect”, “Other”];

function parseDomain(input) {
try {
const url = input.startsWith(“http”) ? input : “https://” + input;
return new URL(url).hostname.replace(/^www./, “”);
} catch {
return input.replace(/^www./, “”).split(”/”)[0].toLowerCase().trim();
}
}

function timeAgo(iso) {
const diff = Date.now() - new Date(iso).getTime();
const m = Math.floor(diff / 60000);
if (m < 1) return “just now”;
if (m < 60) return `${m}m ago`;
const h = Math.floor(m / 60);
if (h < 24) return `${h}h ago`;
const d = Math.floor(h / 24);
return `${d}d ago`;
}

function formatDate(iso) {
return new Date(iso).toLocaleString(“en-US”, {
year: “numeric”, month: “short”, day: “numeric”,
hour: “2-digit”, minute: “2-digit”, second: “2-digit”,
timeZoneName: “short”
});
}

export default function App() {
const [tab, setTab] = useState(“search”);
const [searchQuery, setSearchQuery] = useState(””);
const [searchResults, setSearchResults] = useState(null);
const [allDomains, setAllDomains] = useState([]);
const [submissions, setSubmissions] = useState({});
const [loading, setLoading] = useState(true);
const [submitForm, setSubmitForm] = useState({
domain: “”, browser: BROWSERS[0], type: SCREENSHOT_TYPES[0], note: “”, image: null, imagePreview: null
});
const [submitting, setSubmitting] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState(false);
const [submitError, setSubmitError] = useState(””);
const [lightbox, setLightbox] = useState(null);
const [stats, setStats] = useState({ total: 0, domains: 0 });
const fileRef = useRef();

async function loadData() {
setLoading(true);
try {
const keys = await window.storage.list(“shot:”, true);
const domainSet = new Set();
const data = {};
let total = 0;
for (const key of (keys?.keys || [])) {
try {
const res = await window.storage.get(key, true);
if (res?.value) {
const item = JSON.parse(res.value);
const d = item.domain;
if (!data[d]) data[d] = [];
data[d].push(item);
domainSet.add(d);
total++;
}
} catch {}
}
Object.values(data).forEach(arr => arr.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
setSubmissions(data);
setAllDomains([…domainSet].sort());
setStats({ total, domains: domainSet.size });
} catch {}
setLoading(false);
}

useEffect(() => { loadData(); }, []);

function handleSearch(e) {
e.preventDefault();
const q = parseDomain(searchQuery);
if (!q) return;
const results = {};
for (const [domain, shots] of Object.entries(submissions)) {
if (domain.includes(q)) results[domain] = shots;
}
setSearchResults(results);
}

async function handleSubmit(e) {
e.preventDefault();
if (!submitForm.domain || !submitForm.image) {
setSubmitError(“Domain and screenshot are required.”);
return;
}
setSubmitting(true);
setSubmitError(””);
try {
const domain = parseDomain(submitForm.domain);
const id = `${domain}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
const item = {
id,
domain,
browser: submitForm.browser,
type: submitForm.type,
note: submitForm.note,
image: submitForm.image,
timestamp: new Date().toISOString()
};
await window.storage.set(`shot:${id}`, JSON.stringify(item), true);
setSubmitSuccess(true);
setSubmitForm({ domain: “”, browser: BROWSERS[0], type: SCREENSHOT_TYPES[0], note: “”, image: null, imagePreview: null });
if (fileRef.current) fileRef.current.value = “”;
await loadData();
setTimeout(() => setSubmitSuccess(false), 3000);
} catch (err) {
setSubmitError(“Failed to submit. Please try again.”);
}
setSubmitting(false);
}

function handleFile(e) {
const file = e.target.files[0];
if (!file) return;
if (file.size > 4 * 1024 * 1024) {
setSubmitError(“Image must be under 4MB.”);
return;
}
const reader = new FileReader();
reader.onload = (ev) => {
setSubmitForm(f => ({ …f, image: ev.target.result, imagePreview: ev.target.result }));
};
reader.readAsDataURL(file);
}

const recentShots = Object.values(submissions).flat().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 12);

return (
<div style={{ minHeight: “100vh”, background: “#060a0f”, color: “#c8d8e8”, fontFamily: “‘Courier New’, monospace” }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #0d1520; } ::-webkit-scrollbar-thumb { background: #1a3a55; border-radius: 3px; } .mono { font-family: 'Share Tech Mono', monospace; } .raj { font-family: 'Rajdhani', sans-serif; } .tab-btn { background: none; border: none; color: #4a7a9b; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; padding: 10px 20px; letter-spacing: 0.1em; text-transform: uppercase; transition: all 0.2s; border-bottom: 2px solid transparent; } .tab-btn:hover { color: #00e5ff; } .tab-btn.active { color: #00e5ff; border-bottom: 2px solid #00e5ff; } .btn-primary { background: transparent; border: 1px solid #00e5ff; color: #00e5ff; padding: 10px 24px; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 0.1em; cursor: pointer; transition: all 0.2s; text-transform: uppercase; } .btn-primary:hover { background: #00e5ff; color: #060a0f; } .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; } .input-field { background: #0d1520; border: 1px solid #1a3a55; color: #c8d8e8; padding: 10px 14px; font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; width: 100%; outline: none; transition: border 0.2s; } .input-field:focus { border-color: #00e5ff; } .input-field option { background: #0d1520; } .card { background: #0d1520; border: 1px solid #1a3a55; } .shot-card { background: #0d1520; border: 1px solid #1a3a55; overflow: hidden; transition: border 0.2s, transform 0.2s; cursor: pointer; } .shot-card:hover { border-color: #00e5ff44; transform: translateY(-2px); } .tag { display: inline-block; padding: 2px 8px; font-size: 0.7rem; letter-spacing: 0.08em; font-family: 'Share Tech Mono', monospace; } .tag-blue { background: #001a2e; border: 1px solid #00e5ff44; color: #00e5ff; } .tag-green { background: #001a14; border: 1px solid #00ff8844; color: #00ff88; } .tag-yellow { background: #1a1400; border: 1px solid #ffcc0044; color: #ffcc00; } .tag-red { background: #1a0000; border: 1px solid #ff444444; color: #ff4444; } .tag-gray { background: #111820; border: 1px solid #2a4a65; color: #7a9ab8; } .scan-line { position: fixed; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #00e5ff, transparent); animation: scan 4s linear infinite; pointer-events: none; opacity: 0.3; z-index: 100; } @keyframes scan { 0% { top: 0; } 100% { top: 100vh; } } .glitch { animation: glitch 8s infinite; } @keyframes glitch { 0%,95%,100% { text-shadow: none; } 96% { text-shadow: 2px 0 #ff0040, -2px 0 #00e5ff; } 97% { text-shadow: -2px 0 #ff0040, 2px 0 #00e5ff; } 98% { text-shadow: none; } } .domain-badge { font-family: 'Share Tech Mono', monospace; background: #001a2e; border: 1px solid #003a5e; color: #00b8d9; padding: 2px 10px; font-size: 0.8rem; word-break: break-all; } .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; cursor: zoom-out; } .search-bar-wrap { display: flex; gap: 0; max-width: 640px; width: 100%; margin: 0 auto; } .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; } .corner-tl::before, .corner-tr::after { content: ''; position: absolute; width: 12px; height: 12px; border-color: #00e5ff; border-style: solid; } .upload-area { border: 1px dashed #1a3a55; padding: 32px; text-align: center; transition: border 0.2s; cursor: pointer; } .upload-area:hover { border-color: #00e5ff44; }`}</style>

```
  <div className="scan-line" />

  {/* Header */}
  <header style={{ borderBottom: "1px solid #1a3a55", padding: "0 24px", position: "sticky", top: 0, background: "#060a0f", zIndex: 50 }}>
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, padding: "12px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, border: "1px solid #00e5ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <div className="mono glitch" style={{ fontSize: "1rem", color: "#00e5ff", letterSpacing: "0.15em" }}>MITM.WATCH</div>
          <div style={{ fontSize: "0.6rem", color: "#4a7a9b", letterSpacing: "0.2em" }}>ANTI-INTERCEPTION NETWORK</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div className="tag tag-gray">{stats.total} screenshots</div>
        <div className="tag tag-gray">{stats.domains} domains</div>
      </div>
    </div>
    <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 0, borderTop: "1px solid #0d1a28" }}>
      {[["search", "🔍 Search"], ["submit", "📤 Submit"], ["recent", "🕐 Recent"], ["about", "ℹ About"]].map(([id, label]) => (
        <button key={id} className={`tab-btn ${tab === id ? "active" : ""}`} onClick={() => setTab(id)}>{label}</button>
      ))}
    </div>
  </header>

  <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

    {/* SEARCH TAB */}
    {tab === "search" && (
      <div>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 className="raj" style={{ fontSize: "2.5rem", fontWeight: 700, color: "#e0f0ff", letterSpacing: "0.05em", marginBottom: 8 }}>
            Verify What Others See
          </h1>
          <p style={{ color: "#4a7a9b", fontSize: "0.9rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
            Search any domain to compare screenshots submitted by users worldwide. Inconsistencies may indicate MITM attacks, DNS hijacking, or BGP hijacking.
          </p>
        </div>

        <form onSubmit={handleSearch} className="search-bar-wrap" style={{ marginBottom: 48 }}>
          <input
            className="input-field"
            placeholder="example.com or https://example.com/..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap" }}>Search</button>
        </form>

        {loading && <div className="mono" style={{ textAlign: "center", color: "#4a7a9b", padding: 40 }}>Loading database...</div>}

        {!loading && searchResults !== null && (
          <div>
            {Object.keys(searchResults).length === 0 ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <div className="mono" style={{ color: "#4a7a9b", fontSize: "0.9rem" }}>No results for <span style={{ color: "#00e5ff" }}>{parseDomain(searchQuery)}</span></div>
                <div style={{ color: "#2a4a65", fontSize: "0.8rem", marginTop: 8 }}>Be the first to submit a screenshot for this domain</div>
              </div>
            ) : (
              Object.entries(searchResults).map(([domain, shots]) => (
                <DomainResults key={domain} domain={domain} shots={shots} onLightbox={setLightbox} />
              ))
            )}
          </div>
        )}

        {!loading && searchResults === null && allDomains.length > 0 && (
          <div>
            <div className="mono" style={{ color: "#2a4a65", fontSize: "0.75rem", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>Monitored Domains ({allDomains.length})</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {allDomains.map(d => (
                <button key={d} className="domain-badge" style={{ cursor: "pointer", background: "none", border: "1px solid #003a5e" }}
                  onClick={() => { setSearchQuery(d); setSearchResults({ [d]: submissions[d] }); }}>
                  {d}
                  <span style={{ color: "#4a7a9b", marginLeft: 6 }}>{submissions[d]?.length}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    {/* SUBMIT TAB */}
    {tab === "submit" && (
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 className="raj" style={{ fontSize: "1.8rem", fontWeight: 700, color: "#e0f0ff", marginBottom: 8 }}>Submit a Screenshot</h2>
          <p style={{ color: "#4a7a9b", fontSize: "0.85rem", lineHeight: 1.6 }}>
            Screenshots are shared publicly and help detect inconsistencies that may indicate network interception. Do not submit personal information.
          </p>
        </div>

        {submitSuccess && (
          <div style={{ background: "#001a14", border: "1px solid #00ff8844", padding: "12px 16px", marginBottom: 20, color: "#00ff88" }} className="mono">
            ✓ Screenshot submitted successfully. Thank you for contributing.
          </div>
        )}
        {submitError && (
          <div style={{ background: "#1a0000", border: "1px solid #ff444444", padding: "12px 16px", marginBottom: 20, color: "#ff4444" }} className="mono">
            ✗ {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="mono" style={{ fontSize: "0.75rem", color: "#4a7a9b", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Domain / URL *</label>
            <input className="input-field" placeholder="e.g. google.com or https://google.com"
              value={submitForm.domain} onChange={e => setSubmitForm(f => ({ ...f, domain: e.target.value }))} />
            {submitForm.domain && <div style={{ color: "#4a7a9b", fontSize: "0.75rem", marginTop: 4 }} className="mono">→ Will be stored as: <span style={{ color: "#00e5ff" }}>{parseDomain(submitForm.domain)}</span></div>}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label className="mono" style={{ fontSize: "0.75rem", color: "#4a7a9b", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Browser *</label>
              <select className="input-field" value={submitForm.browser} onChange={e => setSubmitForm(f => ({ ...f, browser: e.target.value }))}>
                {BROWSERS.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="mono" style={{ fontSize: "0.75rem", color: "#4a7a9b", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Page Type *</label>
              <select className="input-field" value={submitForm.type} onChange={e => setSubmitForm(f => ({ ...f, type: e.target.value }))}>
                {SCREENSHOT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="mono" style={{ fontSize: "0.75rem", color: "#4a7a9b", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Screenshot *</label>
            <div className="upload-area" onClick={() => fileRef.current?.click()}>
              {submitForm.imagePreview ? (
                <img src={submitForm.imagePreview} alt="preview" style={{ maxHeight: 200, maxWidth: "100%", objectFit: "contain" }} />
              ) : (
                <div>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>📷</div>
                  <div className="mono" style={{ color: "#4a7a9b", fontSize: "0.8rem" }}>Click to upload screenshot (PNG, JPG, max 4MB)</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
          </div>

          <div>
            <label className="mono" style={{ fontSize: "0.75rem", color: "#4a7a9b", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Notes (optional)</label>
            <textarea className="input-field" rows={3} placeholder="Anything unusual? VPN/Tor in use? ISP or country?"
              value={submitForm.note} onChange={e => setSubmitForm(f => ({ ...f, note: e.target.value }))}
              style={{ resize: "vertical" }} />
          </div>

          <div style={{ background: "#0a1018", border: "1px solid #1a3a55", padding: "12px 16px", fontSize: "0.78rem", color: "#4a7a9b", lineHeight: 1.6 }} className="mono">
            ⚠ Timestamp is recorded automatically. Screenshots are public and shared with all users. Do not include passwords, personal data, or private information in your screenshot.
          </div>

          <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: "flex-start", padding: "12px 32px" }}>
            {submitting ? "Submitting..." : "Submit Screenshot"}
          </button>
        </form>
      </div>
    )}

    {/* RECENT TAB */}
    {tab === "recent" && (
      <div>
        <h2 className="raj" style={{ fontSize: "1.8rem", fontWeight: 700, color: "#e0f0ff", marginBottom: 24 }}>Recent Submissions</h2>
        {loading && <div className="mono" style={{ color: "#4a7a9b" }}>Loading...</div>}
        {!loading && recentShots.length === 0 && (
          <div className="mono" style={{ color: "#4a7a9b" }}>No submissions yet. Be the first!</div>
        )}
        <div className="grid-3">
          {recentShots.map(shot => (
            <ShotCard key={shot.id} shot={shot} onClick={() => setLightbox(shot)} />
          ))}
        </div>
      </div>
    )}

    {/* ABOUT TAB */}
    {tab === "about" && (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 className="raj" style={{ fontSize: "2rem", fontWeight: 700, color: "#e0f0ff", marginBottom: 24 }}>About MITM.WATCH</h2>

        {[
          ["What is a MITM Attack?", `A Man-in-the-Middle (MITM) attack occurs when a third party secretly intercepts and potentially alters communications between two parties. In the context of web browsing, attackers can intercept traffic between you and a website — often invisibly. Techniques include ARP spoofing, DNS hijacking, BGP hijacking, SSL stripping, and rogue access points.`],
          ["How This Site Helps", `By crowdsourcing screenshots of website homepages and error pages from users across different networks, devices, browsers, and locations, we create a distributed verification system. If your homepage for google.com looks different from hundreds of other submissions, that's a red flag worth investigating.`],
          ["What to Look For", `Compare screenshots from the same domain. Red flags include: different SSL certificates or padlock icons, different page layouts or content, unexpected redirects or error pages, pages in a different language than expected, or login pages that look slightly different.`],
          ["Your Privacy", `We record only what you submit: the domain, screenshot, browser, and timestamp. We do not collect your IP address, identity, or any other metadata. Do not submit screenshots containing personal information.`],
          ["Limitations", `This is a community tool and not a substitute for professional security auditing. False positives can occur due to A/B testing, CDN differences, or regional content. Always cross-reference with other tools like SSL certificate checkers and DNS lookup services.`]
        ].map(([title, body]) => (
          <div key={title} className="card" style={{ padding: "20px 24px", marginBottom: 16, borderLeft: "2px solid #00e5ff33" }}>
            <div className="raj" style={{ fontWeight: 600, color: "#00e5ff", marginBottom: 8, fontSize: "1rem" }}>{title}</div>
            <p style={{ color: "#7a9ab8", fontSize: "0.85rem", lineHeight: 1.7 }}>{body}</p>
          </div>
        ))}
      </div>
    )}
  </main>

  {/* Lightbox */}
  {lightbox && (
    <div className="lightbox" onClick={() => setLightbox(null)}>
      <div style={{ maxWidth: "90vw", maxHeight: "90vh", position: "relative" }} onClick={e => e.stopPropagation()}>
        <img src={lightbox.image} alt="screenshot" style={{ maxWidth: "85vw", maxHeight: "80vh", objectFit: "contain", display: "block", border: "1px solid #1a3a55" }} />
        <div style={{ background: "#0d1520", border: "1px solid #1a3a55", borderTop: "none", padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <span className="domain-badge">{lightbox.domain}</span>
          <span className="tag tag-blue">{lightbox.browser}</span>
          <span className="tag tag-green">{lightbox.type}</span>
          <span className="mono" style={{ fontSize: "0.75rem", color: "#4a7a9b", marginLeft: "auto" }}>{formatDate(lightbox.timestamp)}</span>
          <button onClick={() => setLightbox(null)} style={{ background: "none", border: "none", color: "#4a7a9b", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
        </div>
        {lightbox.note && <div style={{ background: "#080e18", border: "1px solid #1a3a55", borderTop: "none", padding: "8px 16px", color: "#7a9ab8", fontSize: "0.8rem" }} className="mono">📝 {lightbox.note}</div>}
      </div>
    </div>
  )}
</div>
```

);
}

function DomainResults({ domain, shots, onLightbox }) {
const typeCount = shots.reduce((a, s) => { a[s.type] = (a[s.type] || 0) + 1; return a; }, {});
return (
<div style={{ marginBottom: 40 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 12, marginBottom: 16, flexWrap: “wrap” }}>
<h3 className=“mono” style={{ color: “#00e5ff”, fontSize: “1.1rem” }}>{domain}</h3>
<span className="tag tag-gray">{shots.length} screenshot{shots.length !== 1 ? “s” : “”}</span>
{Object.entries(typeCount).map(([t, n]) => (
<span key={t} className="tag tag-blue">{t}: {n}</span>
))}
</div>
<div className="grid-3">
{shots.map(shot => <ShotCard key={shot.id} shot={shot} onClick={() => onLightbox(shot)} />)}
</div>
</div>
);
}

function ShotCard({ shot, onClick }) {
const typeColor = { “Error Page”: “tag-red”, “Homepage”: “tag-green”, “Login Page”: “tag-yellow”, “Redirect”: “tag-yellow” };
return (
<div className="shot-card" onClick={onClick}>
<div style={{ height: 160, overflow: “hidden”, background: “#060a0f”, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
{shot.image
? <img src={shot.image} alt=“screenshot” style={{ width: “100%”, height: “100%”, objectFit: “cover” }} />
: <div className=“mono” style={{ color: “#2a4a65”, fontSize: “0.75rem” }}>No preview</div>}
</div>
<div style={{ padding: “10px 12px” }}>
<div className=“domain-badge” style={{ marginBottom: 8, display: “inline-block” }}>{shot.domain}</div>
<div style={{ display: “flex”, flexWrap: “wrap”, gap: 4, marginBottom: 8 }}>
<span className={`tag ${typeColor[shot.type] || "tag-gray"}`}>{shot.type}</span>
<span className=“tag tag-blue” style={{ maxWidth: 140, overflow: “hidden”, textOverflow: “ellipsis”, whiteSpace: “nowrap” }}>{shot.browser}</span>
</div>
<div className=“mono” style={{ fontSize: “0.7rem”, color: “#4a7a9b” }} title={new Date(shot.timestamp).toLocaleString()}>
🕐 {timeAgo(shot.timestamp)}
<span style={{ float: “right”, color: “#2a4a65” }}>{new Date(shot.timestamp).toLocaleDateString()}</span>
</div>
{shot.note && <div className=“mono” style={{ fontSize: “0.7rem”, color: “#3a6a88”, marginTop: 6, overflow: “hidden”, textOverflow: “ellipsis”, whiteSpace: “nowrap” }}>📝 {shot.note}</div>}
</div>
</div>
);
}
