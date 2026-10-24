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

For the current move to a new VPS, follow [deploy/MIGRATION.md](deploy/MIGRATION.md). It covers preserving the existing database/environment, transferring media, staging the new server and switching DNS.

See [deploy/README.md](deploy/README.md) for the full configuration reference.

```bash
# Already live: preserve the current database URI, signing key and provider
# credentials in the root .env; verify the existing proxy, storage and backup.
# See the existing-installation section of deploy/README.md first.
bash deploy/server-deploy.sh existing --prepare
# After verifying files/database and switching DNS to the destination:
bash deploy/server-deploy.sh existing
# If the DESTINATION has an existing shared Caddy, use "existing-shared" instead.
```

Production uses the root .env; it is never committed or copied into frontend images. Existing-installation modes reuse the configured live database and disable new database startup, sample data seeding and admin creation. The locally generated root .env is a template; verify it against the VPS before deployment.

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

Production auth uses database users and signed JWTs. The admin account is created from environment settings on first startup. BusinessAI CMS writes require staff access. Readiness checks require a connected database and completed startup.
