#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_DIR="$(mktemp -d "${TMPDIR:-/tmp}/be-ssh-test.XXXXXX")"
cleanup() {
  [[ "$TEST_DIR" = "${TMPDIR:-/tmp}/be-ssh-test."* ]] || return 1
  rm -rf -- "$TEST_DIR"
}
trap cleanup EXIT
ssh-keygen -q -t ed25519 -N '' -C ci-fixture -f "$TEST_DIR/source-key"
export VPS_HOST=76.13.185.120 VPS_USER=fixture VPS_PORT=22
export VPS_KNOWN_HOSTS=fixture-public-host-entry BE_SSH_DIR="$TEST_DIR/prepared"
VPS_SSH_KEY="$(sed 's/$/\r/' "$TEST_DIR/source-key")"
export VPS_SSH_KEY
bash "$PROJECT_DIR/deploy/prepare-ssh.sh" > "$TEST_DIR/result"
expected="$(awk '{ print $1 " " $2 }' "$TEST_DIR/source-key.pub")"
actual="$(awk '{ print $1 " " $2 }' "$TEST_DIR/prepared/deploy_key.pub")"
[[ "$actual" = "$expected" ]]
VPS_SSH_KEY=invalid-key-fixture
export VPS_SSH_KEY
if bash "$PROJECT_DIR/deploy/prepare-ssh.sh" > "$TEST_DIR/invalid-result" 2>/dev/null; then
  echo "Invalid private key was accepted." >&2; exit 1
fi
if grep -q DEPLOY_PUBLIC_KEY= "$TEST_DIR/invalid-result"; then exit 1; fi
echo "SSH preparation passed: CRLF normalization, matching public key and invalid-key rejection."
