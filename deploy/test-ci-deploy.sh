#!/usr/bin/env bash
# Exercises rollout and rollback with fake system commands, without a VPS/Docker.
set -Eeuo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/be-ci-tests.XXXXXX")"
cleanup() {
  [[ "$TEST_ROOT" = "${TMPDIR:-/tmp}/be-ci-tests."* && -d "$TEST_ROOT" ]] || return 1
  rm -rf -- "$TEST_ROOT"
}
trap cleanup EXIT
NEW_TAG=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
OLD_TAG=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
mkdir -p "$TEST_ROOT/bin"
cat > "$TEST_ROOT/bin/docker" <<'MOCK'
#!/usr/bin/env bash
printf 'docker tag=%s %s\n' "${IMAGE_TAG:-}" "$*" >> "$TEST_LOG"
if [[ "$1" = login ]]; then cat >/dev/null; exit 0; fi
if [[ " $* " = *' run '* && "${FAIL_STAGE:-}" = env ]]; then exit 1; fi
if [[ " $* " = *' up '* && "${FAIL_STAGE:-}" = up && "$IMAGE_TAG" = a* ]]; then exit 1; fi
if [[ " $* " = *' exec -T be-'* && "${FAIL_STAGE:-}" = health && "$IMAGE_TAG" = a* ]]; then exit 1; fi
if [[ " $* " = *' exec healthoil-nginx-1 nginx -t '* && "${FAIL_STAGE:-}" = nginx && "$IMAGE_TAG" = a* ]]; then exit 1; fi
MOCK
cat > "$TEST_ROOT/bin/curl" <<'MOCK'
#!/usr/bin/env bash
printf 'curl %s\n' "$*" >> "$TEST_LOG"
if [[ " $* " = *https://* ]]; then
  [[ "${FAIL_STAGE:-}" != https ]] || exit 22
  if [[ "$*" = *'%{redirect_url}'* ]]; then echo https://businessexperts.asia/; exit 0; fi
  if [[ "$*" = *'/api/'* || "$*" = *'/ai-api/'* ]]; then
    [[ "${FAIL_STAGE:-}" != type ]] || { echo text/html; exit 0; }
    echo application/json
  else echo text/html; fi
fi
MOCK
cat > "$TEST_ROOT/bin/nginx" <<'MOCK'
#!/usr/bin/env bash
echo "nginx $*" >> "$TEST_LOG"
[[ "${FAIL_STAGE:-}" != nginx || "${IMAGE_TAG:-}" != a* ]]
MOCK
cat > "$TEST_ROOT/bin/systemctl" <<'MOCK'
#!/usr/bin/env bash
echo "systemctl $*" >> "$TEST_LOG"
MOCK
cat > "$TEST_ROOT/bin/flock" <<'MOCK'
#!/usr/bin/env bash
exit 0
MOCK
cat > "$TEST_ROOT/bin/openssl" <<'MOCK'
#!/usr/bin/env bash
echo "openssl $*" >> "$TEST_LOG"
[[ "${FAIL_STAGE:-}" != certificate ]]
MOCK
chmod +x "$TEST_ROOT/bin/"*
export PATH="$TEST_ROOT/bin:$PATH"

run_case() {
  local name=$1 mode=$2 fail=$3 previous=$4 expected=$5
  local root="$TEST_ROOT/$name"
  local release="$root/releases/$NEW_TAG"
  mkdir -p "$release/deploy" "$root/shared/state" "$root/nginx" "$root/certs"
  cp "$PROJECT_DIR/deploy/ci-deploy.sh" "$release/deploy/"
  cp -R "$PROJECT_DIR/deploy/nginx" "$release/deploy/"
  cp "$PROJECT_DIR/deploy/compose.production.yml" "$release/deploy/"
  echo 'MONGODB_URI=mongodb://example.invalid/test' > "$root/shared/.env"
  echo old-nginx > "$root/nginx/business-experts.conf"
  echo existing-healthoil-site > "$root/nginx/app.conf"
  for file in business-experts-proxy.inc business-experts-api.inc business-experts-tls.inc; do echo old-snippet > "$root/nginx/$file"; done
  echo fixture > "$root/certs/fullchain.pem"
  echo fixture > "$root/certs/privkey.pem"
  if [[ "$previous" = yes ]]; then
    mkdir -p "$root/releases/$OLD_TAG/deploy"
    cp "$PROJECT_DIR/deploy/compose.production.yml" "$root/releases/$OLD_TAG/deploy/"
    printf 'IMAGE_PREFIX=ghcr.io/example/business_experts\nIMAGE_TAG=%s\n' "$OLD_TAG" > "$root/shared/state/current.env"
  fi
  local status=0
  printf 'fixture-token\n' | BE_DEPLOY_ROOT="$root" BE_NGINX_DIR="$root/nginx" BE_CERT_DIR="$root/certs" \
    TEST_LOG="$root/calls.log" FAIL_STAGE="$fail" bash "$release/deploy/ci-deploy.sh" \
    ghcr.io/example/business_experts "$NEW_TAG" "$mode" test-user > "$root/output.log" 2>&1 || status=$?
  if [[ "$expected" = success ]]; then
    [[ "$status" = 0 ]] || { cat "$root/output.log"; return 1; }
    grep -q "IMAGE_TAG=$NEW_TAG" "$root/shared/state/current.env"
    if [[ "$mode" = prepare ]]; then
      if grep -q 'https://' "$root/calls.log"; then echo "Prepare attempted HTTPS checks" >&2; return 1; fi
      if grep -q 'systemctl' "$root/calls.log"; then echo "Prepare reloaded Nginx" >&2; return 1; fi
      grep -q old-nginx "$root/nginx/business-experts.conf"
    fi
  else
    [[ "$status" != 0 ]] || { echo "Expected failure in $name" >&2; return 1; }
    if [[ "$previous" = yes ]]; then
      grep -q "IMAGE_TAG=$OLD_TAG" "$root/shared/state/current.env"
      if [[ "$fail" != env && "$fail" != certificate ]]; then grep -q "docker tag=$OLD_TAG.* up " "$root/calls.log"; fi
    elif [[ "$fail" != env && "$fail" != certificate ]]; then
      grep -q ' stop$' "$root/calls.log"
      [[ ! -f "$root/shared/state/current.env" ]]
    fi
    grep -q old-nginx "$root/nginx/business-experts.conf"
  fi
  if grep -q fixture-token "$root/calls.log"; then echo "Registry token appeared in logs" >&2; return 1; fi
  grep -q existing-healthoil-site "$root/nginx/app.conf"
  echo "PASS $name"
}

run_case prepare prepare '' no success
run_case deploy deploy '' yes success
run_case unhealthy deploy health yes failure
run_case failed-start deploy up yes failure
run_case failed-nginx deploy nginx yes failure
run_case failed-https deploy https yes failure
run_case wrong-api-type deploy type yes failure
run_case first-release-failure deploy health no failure
run_case invalid-environment deploy env yes failure
run_case wrong-certificate deploy certificate yes failure
