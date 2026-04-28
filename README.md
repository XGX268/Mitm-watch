# 🛡️ MITM.WATCH

> **A crowdsourced screenshot verification network to help detect Man-in-the-Middle attacks, DNS hijacking, and BGP interception.**

-----

```
 ███╗   ███╗██╗████████╗███╗   ███╗   ██╗    ██╗ █████╗ ████████╗ ██████╗██╗  ██╗
 ████╗ ████║██║╚══██╔══╝████╗ ████║   ██║    ██║██╔══██╗╚══██╔══╝██╔════╝██║  ██║
 ██╔████╔██║██║   ██║   ██╔████╔██║   ██║ █╗ ██║███████║   ██║   ██║     ███████║
 ██║╚██╔╝██║██║   ██║   ██║╚██╔╝██║   ██║███╗██║██╔══██║   ██║   ██║     ██╔══██║
 ██║ ╚═╝ ██║██║   ██║   ██║ ╚═╝ ██║   ╚███╔███╔╝██║  ██║   ██║   ╚██████╗██║  ██║
 ╚═╝     ╚═╝╚═╝   ╚═╝   ╚═╝     ╚═╝    ╚══╝╚══╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝
```

<div align="center">

![Status](https://img.shields.io/badge/status-active%20development-yellow?style=flat-square)
![Contributions](https://img.shields.io/badge/contributions-welcome-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-open-orange?style=flat-square)

**⚠️ This project is actively under development. Features are incomplete, APIs may change, and bugs are expected. We warmly welcome contributors of all skill levels.**

</div>

-----

## 🚧 Project Status

MITM.WATCH is in **early active development**. We are building the foundations of a community-driven tool that helps everyday users detect suspicious alterations to websites they visit — a sign of potential network-level interception.

**What works today:**

- Screenshot submission with domain, browser label, page type, and timestamp
- Domain search with grouped results across submission history
- Shared persistent storage across all users
- Lightbox screenshot viewer with full metadata

**What’s still being built:**

- [ ] User accounts and optional attribution
- [ ] Screenshot diff / visual comparison tool
- [ ] Automated anomaly detection and flagging
- [ ] TLS certificate fingerprint comparison
- [ ] Regional filtering and map view
- [ ] API for programmatic submission
- [ ] Mobile-friendly PWA version
- [ ] Tor / VPN tagging and filtering
- [ ] Notification system for watched domains
- [ ] Moderation tools and report system

We expect the feature set to evolve significantly. Nothing is final.

-----

## 📖 What Is a MITM Attack?

A **Man-in-the-Middle (MITM)** attack occurs when a third party secretly intercepts communications between a user and a website — often without either party knowing. Common techniques include:

- **DNS hijacking** — Your DNS queries are redirected to a malicious resolver, returning fake IP addresses.
- **BGP hijacking** — Internet routing is manipulated at a global level to redirect traffic through an attacker-controlled network.
- **ARP spoofing** — On a local network, an attacker poisons ARP caches to intercept local traffic.
- **SSL stripping** — Downgrades HTTPS connections to unencrypted HTTP to expose sensitive data.
- **Rogue access points** — Fake Wi-Fi hotspots that transparently proxy all traffic.

MITM.WATCH provides a **crowdsourced baseline** — by comparing what a website looks like across hundreds of submissions from different users, networks, and locations, anomalies become visible.

-----

## 🏗️ Architecture

```
mitm-watch/
├── src/
│   ├── App.jsx              # Main React application
│   ├── components/
│   │   ├── ShotCard.jsx     # Screenshot card component
│   │   ├── DomainResults.jsx
│   │   ├── SubmitForm.jsx
│   │   └── Lightbox.jsx
│   ├── utils/
│   │   ├── parseDomain.js   # URL normalization
│   │   ├── storage.js       # Shared storage abstraction
│   │   └── formatters.js    # Date / time utilities
│   └── constants.js         # Browser list, page types, etc.
├── public/
├── README.md
└── package.json
```

> **Note:** The file structure above reflects the planned modular layout. The current codebase is still being refactored into this structure. See [open issues](#-contributing) for relevant tasks.

-----

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
git clone https://github.com/your-org/mitm-watch.git
cd mitm-watch
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

> ⚠️ A production backend is not yet implemented. The current version uses a shared key-value storage layer (Claude Artifact persistent storage). Backend infrastructure (API, database, auth) is planned and tracked in [Issues](https://github.com/your-org/mitm-watch/issues).

-----

## 🤝 Contributing

**We actively want your help.** Whether you’re a security researcher, frontend developer, UX designer, or just someone who cares about internet freedom — there is a place for you here.

This project is intentionally open and welcoming. No contribution is too small.

### Ways to Contribute

- 🐛 **Report bugs** — Open an issue with steps to reproduce
- 💡 **Suggest features** — Open a discussion or issue
- 🎨 **Improve UI/UX** — The interface is functional but far from polished
- 🔐 **Security review** — Audit the submission pipeline and storage model
- 📝 **Improve documentation** — Clarify anything confusing
- 🌍 **Translations** — Help localize the interface
- 🧪 **Write tests** — We have essentially none right now
- 📊 **Data analysis** — Help design the anomaly detection system

### Contribution Workflow

1. Fork the repository
1. Create a feature branch: `git checkout -b feature/your-feature-name`
1. Make your changes
1. Open a pull request with a clear description of what you changed and why

Please keep PRs focused and small where possible. Large PRs are harder to review.

### Code Style

- React functional components with hooks
- Tailwind utility classes for styling
- Descriptive variable names — clarity over brevity
- No TypeScript requirement yet, but typed PRs are welcome

-----

## 🔒 Privacy & Ethics

MITM.WATCH is built with user privacy in mind:

- **No user accounts required** to submit or search
- **No IP addresses** are logged or stored
- **Screenshots are public** — contributors should not include personal information, login credentials, or sensitive content in their screenshots
- The project does **not** collect analytics or behavioral data

If you discover a privacy concern, please open a confidential issue or contact the maintainers directly before publishing.

-----

## 🛠️ Roadmap

|Milestone                          |Status       |
|-----------------------------------|-------------|
|Core screenshot submission & search|✅ Complete   |
|Shared real-time storage           |✅ Complete   |
|Lightbox viewer with metadata      |✅ Complete   |
|Component refactor & modularization|🔄 In progress|
|Backend API (REST)                 |⏳ Planned    |
|Visual diff tool                   |⏳ Planned    |
|TLS fingerprint comparison         |⏳ Planned    |
|User accounts (optional)           |⏳ Planned    |
|Anomaly detection engine           |⏳ Planned    |
|Mobile PWA                         |⏳ Planned    |
|Public API for researchers         |⏳ Planned    |

-----

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

You are free to use, modify, and distribute this project. Attribution is appreciated but not required.

-----

## 🙏 Acknowledgements

Inspired by the work of security researchers, network transparency advocates, and the broader open internet community. This tool exists because the internet is healthier when users can verify what they see.

-----

<div align="center">

**⭐ If you find this project useful, consider starring the repo — it helps others discover it.**

Built with ❤️ by contributors worldwide · [Open an Issue](https://github.com/your-org/mitm-watch/issues) · [Start a Discussion](https://github.com/your-org/mitm-watch/discussions)

</div>
