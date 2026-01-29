# PXG.STUDIO Game Development Repository

**PXG.STUDIO** - Professional game development codebase repository hosted on GitLab.

## 🎮 Overview

This repository contains the game development codebase for PXG.STUDIO projects. It's configured for GitLab CI/CD workflows and optimized for collaborative game development.

## 📁 Repository Structure

```
.
├── assets/          # Game assets (sprites, models, audio, etc.)
├── code/            # Source code
├── docs/            # Documentation
├── tools/           # Development tools and scripts
├── builds/          # Build outputs (gitignored)
└── tests/           # Test suites
```

## 🚀 Quick Start

1. Clone the repository:
```bash
git clone https://gitlab.pxg.studio/pxg-studio/game-repo.git
cd game-repo
```
(Or over HTTP: `http://192.168.86.29/pxg-studio/game-repo.git` if domain/SSL is not configured.)

2. Install dependencies:
```bash
npm install
```

3. Start development:
```bash
npm run dev
```

## 🛠️ Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Lint code

## 📋 GitLab CI/CD

This repository is configured with GitLab CI/CD pipelines for:
- Automated testing
- Build verification
- Deployment workflows

See `.gitlab-ci.yml` for pipeline configuration.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a merge request
4. Ensure CI/CD pipelines pass

## 📝 License

Proprietary / UNLICENSED. See `package.json` for details.

## 🔗 Links

- **GitLab Repository**: [https://gitlab.pxg.studio/pxg-studio/game-repo](https://gitlab.pxg.studio/pxg-studio/game-repo) (or `http://192.168.86.29/pxg-studio/game-repo` without SSL)
- **Production Setup**: [docs/PRODUCTION_SETUP.md](docs/PRODUCTION_SETUP.md)
- **GitLab production config** (docker-compose, backup, Nginx, Prometheus, Grafana): [config/gitlab-production/](config/gitlab-production/)
- **Deploy to production**: [docs/PRODUCTION_DEPLOYMENT.md](docs/PRODUCTION_DEPLOYMENT.md)
- **Maintenance**: [docs/MAINTENANCE.md](docs/MAINTENANCE.md)
- **Troubleshooting**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
- Enable SSH on SBX04: [docs/ENABLE_SSH_SBX04.md](docs/ENABLE_SSH_SBX04.md)
- SBX04 final steps: [docs/SBX04_FINAL_STEPS.md](docs/SBX04_FINAL_STEPS.md)
- **Complete all outstanding tasks** (when SBX04 is up): [docs/COMPLETE_OUTSTANDING_TASKS.md](docs/COMPLETE_OUTSTANDING_TASKS.md)
- **Set up LUMINES on GitLab**: [docs/GITLAB_FIRST_REPO_LUMINES.md](docs/GITLAB_FIRST_REPO_LUMINES.md)
- **GitLab CLI (glab)**: [docs/GITLAB_CLI_SETUP.md](docs/GITLAB_CLI_SETUP.md)

---

**PXG.STUDIO** - Building games with passion and precision.
