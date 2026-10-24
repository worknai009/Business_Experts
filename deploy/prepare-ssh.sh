#!/usr/bin/env bash
# Derive only the public key so a new VPS can authorize the existing CI identity.
set -euo pipefail
: "${VPS_HOST:?Set VPS_HOST}" "${VPS_USER:?Set VPS_USER}"
: "${VPS_SSH_KEY:?Set VPS_SSH_KEY}" "${VPS_KNOWN_HOSTS:?Set VPS_KNOWN_HOSTS}"
[[ "$VPS_HOST" = 76.13.185.120 ]] || { echo "VPS_HOST must be the new VPS 76.13.185.120." >&2; exit 1; }
[[ "${VPS_PORT:-22}" =~ ^[0-9]+$ && "$VPS_USER" =~ ^[a-zA-Z_][a-zA-Z0-9_-]*$ ]] || exit 1
SSH_DIR="${BE_SSH_DIR:-$HOME/.ssh}"
install -d -m 700 "$SSH_DIR"
# Windows CRLF is safe to normalize; preserve the actual key content/newlines.
printf '%s\n' "$VPS_SSH_KEY" | tr -d '\r' > "$SSH_DIR/deploy_key"
printf '%s\n' "$VPS_KNOWN_HOSTS" | tr -d '\r' > "$SSH_DIR/known_hosts"
chmod 600 "$SSH_DIR/deploy_key" "$SSH_DIR/known_hosts"
if ! ssh-keygen -y -P '' -f "$SSH_DIR/deploy_key" > "$SSH_DIR/deploy_key.pub"; then
  echo "::error::VPS_SSH_KEY must contain a complete, valid SSH private key usable without an interactive passphrase."
  exit 1
fi
echo "Public key fingerprint for the configured CI identity:"
ssh-keygen -lf "$SSH_DIR/deploy_key.pub"
printf 'DEPLOY_PUBLIC_KEY=%s\n' "$(cat "$SSH_DIR/deploy_key.pub")"
