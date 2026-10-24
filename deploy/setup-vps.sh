#!/usr/bin/env bash
# One-time setup on the NEW VPS. Run as root, first with --prepare.
set -Eeuo pipefail
[[ "$EUID" -eq 0 ]] || { echo "Run this setup as root." >&2; exit 1; }
[[ "$(uname -m)" = x86_64 ]] || { echo "The current CI images target linux/amd64." >&2; exit 1; }
ACTION="${1:---prepare}"
[[ "$ACTION" = --prepare || "$ACTION" = *@*.* ]] || { echo "Usage: bash deploy/setup-vps.sh [--prepare|TLS_EMAIL]" >&2; exit 1; }
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck disable=SC1091
source /etc/os-release
[[ "$ID" = ubuntu || "$ID" = debian ]] || { echo "Supported systems: Ubuntu and Debian." >&2; exit 1; }

if command -v ss >/dev/null && ss -H -ltnp '( sport = :80 or sport = :443 )' | grep -v nginx | grep -q .; then
  echo "Ports 80/443 are occupied by another proxy. Inspect the destination before installing Nginx." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl gnupg nginx certbot util-linux
if ! command -v docker >/dev/null || ! docker compose version >/dev/null 2>&1; then
  install -m 755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/$ID/gpg" -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  arch="$(dpkg --print-architecture)"
  printf 'deb [arch=%s signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/%s %s stable\n' \
    "$arch" "$ID" "$VERSION_CODENAME" > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
systemctl enable --now docker nginx

install -d -m 755 /opt/business-experts/releases /opt/business-experts/shared
install -d -m 700 /opt/business-experts/shared/state
install -d -o 1000 -g 1000 -m 755 /opt/business-experts/shared/uploads /opt/business-experts/shared/ai-data
if [[ ! -f /opt/business-experts/shared/.env ]]; then
  install -m 600 "$PROJECT_DIR/.env.example" /opt/business-experts/shared/.env
  echo "Created a TEMPLATE at /opt/business-experts/shared/.env. Replace it privately with verified production settings."
fi
install -d -m 755 /etc/nginx/snippets /var/www/letsencrypt/.well-known/acme-challenge
install -m 644 "$PROJECT_DIR/deploy/nginx/snippets/"*.conf /etc/nginx/snippets/
install -d -m 755 /etc/letsencrypt/renewal-hooks/deploy
install -m 755 "$PROJECT_DIR/deploy/nginx/renew-hook.sh" /etc/letsencrypt/renewal-hooks/deploy/business-experts-nginx

CERT_DIR=/etc/letsencrypt/live/businessexperts.asia
if [[ ! -s "$CERT_DIR/fullchain.pem" ]]; then
  install -m 644 "$PROJECT_DIR/deploy/nginx/bootstrap.conf" /etc/nginx/conf.d/business-experts.conf
  nginx -t
  systemctl reload nginx
  if [[ "$ACTION" = --prepare ]]; then
    echo "VPS prepared. Configure shared/.env, transfer uploads/AI content, and run CI in prepare mode before DNS cutover."
    exit 0
  fi
  certbot certonly --non-interactive --agree-tos --email "$ACTION" \
    --webroot --webroot-path /var/www/letsencrypt --cert-name businessexperts.asia \
    -d businessexperts.asia -d admin.businessexperts.asia \
    -d analytics.businessexperts.asia -d api.businessexperts.asia
fi
install -m 644 "$PROJECT_DIR/deploy/nginx/production.conf" /etc/nginx/conf.d/business-experts.conf
nginx -t
systemctl reload nginx
systemctl enable --now certbot.timer
echo "Nginx HTTPS configured. Enable the GitHub deployment job after the application/environment are ready."
