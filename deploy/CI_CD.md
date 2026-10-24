# Shared Docker + Nginx CI/CD

Repository: worknai009/Business_Experts. Destination: **76.13.185.120**.

The inspected VPS runs Ubuntu 24.04 and already hosts other projects. healthoil-nginx-1 owns ports 80/443; CyberShield owns host port 5000. This pipeline shares the existing Nginx/Certbot infrastructure and publishes **no Business Experts host ports**. Do not use the earlier standalone Caddy/host-Nginx instructions on this shared server.

## Delivery flow

Pull requests run backend tests, frontend builds, rollback/SSH tests, Compose/Nginx validation and Docker builds. Main pushes publish four SHA-tagged images to GHCR, then deploy when DEPLOY_ENABLED is true. Manual mode prepare starts/checks the app without activating HTTPS routes; deploy performs the full rollout. Failed rollouts attempt to restore previous application images and only this application's four Nginx files.

The four services have unique names be-backend, be-frontend, be-admin and be-analytics on external network healthoil_app-network. Generic backend/admin aliases are avoided to prevent collisions with other projects. Nginx reaches the API on container port 5000 and frontends on container port 80. The existing Atlas database is reused; demo seeding and admin bootstrap remain disabled.

## Persistent paths

| Path | Purpose |
| --- | --- |
| /opt/business-experts/releases/COMMIT_SHA | Release scripts and config |
| /opt/business-experts/shared/.env | Private production credentials |
| /opt/business-experts/shared/uploads | Persistent uploads |
| /opt/business-experts/shared/ai-data/site_content.json | Persistent AI CMS content |
| /opt/business-experts/shared/state/current.env | Last verified image metadata |
| /var/www/HealthOil/nginx/conf.d/business-experts.conf | This site's routes only |
| /var/www/HealthOil/nginx/conf.d/business-experts-*.inc | This site's includes |
| /var/www/HealthOil/certbot/conf/live/businessexperts.asia | This site's separate SAN certificate |

The deployment never edits HealthOil app.conf, safy.in.conf or other projects' config files, and does not stop/recreate the shared proxy. It runs nginx -t before a graceful container reload.

## GitHub configuration

Settings -> Secrets and variables -> Actions:

| Secret | Value |
| --- | --- |
| VPS_HOST | 76.13.185.120 |
| VPS_USER | root (verified) |
| VPS_PORT | 22 (verified) |
| VPS_SSH_KEY | CI private key; its matching public key is authorized on this VPS |
| VPS_KNOWN_HOSTS | Verified host-key entry for this server/port |

GITHUB_TOKEN is automatic; no permanent registry PAT is required. It is passed to the remote Docker login on stdin and its temporary Docker credential directory is removed after deployment.

Repository variable DEPLOY_ENABLED=true activates the deploy job. Optional VITE_GOOGLE_CLIENT_ID is a public frontend OAuth client ID, never a private secret.

## One-time private environment transfer

Run `node deploy/prepare-production-env.mjs` locally to create the ignored .env.production.ready from backend/.env. Source files stay unchanged. It preserves database/provider values and creates a strong new JWT secret if the source uses a weak/development key; users must sign in again on the new deployment.

The source .env is now already present on the VPS at /var/www/Business_Experts/.env. Prepare shared VPS creates shared/.env from that file entirely on the same server, using a network-isolated Node container. Credentials are not uploaded to GitHub or sent through the Actions runner. An existing shared/.env is preserved. SMTP app-password display spacing is normalized and a strong JWT is generated only when the source JWT is weak. Regular deployments never upload/overwrite application secrets.

## Prepare the shared VPS

Run Actions -> Prepare shared VPS -> phase prepare. CLI alternative from the current source on the VPS:

```bash
sudo bash deploy/setup-shared-vps.sh --prepare
```

Setup verifies the real proxy/network mounts, creates only this app's storage, and adds its own HTTP challenge site. It copies repository uploads/AI-content snapshots from /var/www/Business_Experts without overwriting shared data. Newer changes on the old live VPS still need a final synchronization before cutover; the repository alone cannot prove those files are current. Add the new outbound IP to the existing Atlas access list when required.

Next run CI and production deployment manually with mode prepare. All four app containers must become healthy before HTTPS activation.

## DNS and TLS

Point the @, www, admin, analytics and api A records at 76.13.185.120. www is included in the certificate and redirects to the apex over verified HTTPS. Preserve other active hosts separately. Add AAAA only if IPv6 also reaches this server.

Run Prepare shared VPS -> phase tls, or:

```bash
sudo bash deploy/setup-shared-vps.sh --tls
```

The existing Certbot container obtains a separate certificate for these four names using /var/www/certbot. Contact email is taken from the production GMAIL_USER/ADMIN_EMAIL, or supplied with TLS_EMAIL. The business-experts-renew timer checks this certificate hourly and reloads the existing proxy only when certificate content changes. Other projects' certificates/settings are preserved.

Run CI and production deployment with mode deploy after issuance. Future main pushes use full deployment automatically when enabled. HTTPS checks use curl --resolve against local port 443 with real certificate verification, so cached DNS cannot accidentally verify the old VPS.

## SSH troubleshooting

Actions -> Check VPS SSH access runs a read-only test/inventory. It validates private-key format, normalizes CRLF, and prints only the matching public key and fingerprint. For Permission denied, authorize that PUBLIC key in the exact VPS_USER account's ~/.ssh/authorized_keys. Directory/file modes should be 700/600 with correct ownership. The workflow does not enable passwords or weaken SSH policy.

## Backups and recovery

Use the existing Atlas backup/export process. Back up shared/.env, uploads and ai-data privately outside the VPS. Preserve current/previous release directories and images for rollback. Do not prune all Docker images during deployment. Rollback restores application images/config, not database writes or changes to shared files/secrets. Container replacement can cause a brief application interruption. Other projects continue running.

The old backup.sh and standalone setup-vps.sh refer to different deployment layouts and are not the shared-server setup path.

## References

- https://docs.github.com/en/actions/tutorials/publish-packages/publish-docker-images
- https://docs.docker.com/compose/how-tos/networking/
- https://nginx.org/en/docs/control.html
- https://eff-certbot.readthedocs.io/en/stable/using.html
