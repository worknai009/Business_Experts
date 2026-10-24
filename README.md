# Business Experts Asia

One Express/MongoDB backend and three React/Vite frontends.

| App | Folder | Development URL | Production domain |
| --- | --- | --- | --- |
| Public website | apps/business-experts | http://localhost:5180 | businessexperts.asia |
| Admin | apps/admin | http://localhost:5181 | admin.businessexperts.asia |
| BusinessAI | apps/business-ai | http://localhost:5173 | analytics.businessexperts.asia |
| Unified backend | backend | http://localhost:5000 | api.businessexperts.asia |

Target VPS: **76.13.185.120**.

## Deployment

The current CI/CD pipeline uses **GitHub Actions, Docker/GHCR and Nginx**. Follow [deploy/CI_CD.md](deploy/CI_CD.md) for VPS setup, GitHub secrets, HTTPS, staging and automatic deployment.

For the move to the new VPS, [deploy/MIGRATION.md](deploy/MIGRATION.md) also documents locating the old files/database settings. The older [deployment reference](deploy/README.md) describes the separate manual Caddy setup.

```bash
# One-time setup ON THE NEW VPS, from an uploaded/checked-out source directory:
sudo bash deploy/setup-vps.sh --prepare
# Configure /opt/business-experts/shared/.env and migrate uploads/AI content.
# Configure the GitHub secrets and run Actions in prepare mode.
# After DNS cutover, issue TLS using your real contact email:
sudo bash deploy/setup-vps.sh your-real-email@example.com
# Run Actions in deploy mode; future main pushes deploy automatically when enabled.
```

CI/CD production uses /opt/business-experts/shared/.env, separate from release files. It reuses the configured live database and disables new database startup, sample data seeding and admin creation. The locally generated root .env is a template; verify real production settings before deployment. Legacy manual Compose commands still use the root .env.

## Local development

Use Node 24 and a local MongoDB instance.

```bash
npm run install:all
# Copy backend/.env.example to backend/.env and configure local settings.
npm run dev
```

All frontend API calls use /api or /ai-api. Vite proxies them to localhost:5000 in development; Caddy proxies them to the backend in production.

```bash
npm run build
npm test
```

Production auth uses database users and signed JWTs. CI/CD preserves existing user accounts; administrator bootstrap is disabled. BusinessAI CMS writes require staff access. Readiness checks require a connected database and completed startup.
