#!/bin/sh
set -eu

secrets_dir="${AUTOPILOT_SECRETS_DIR:-${XDG_CONFIG_HOME:-$HOME/.config}/autopilot-hq/secrets}"

if ! command -v openssl >/dev/null 2>&1; then
  echo "openssl is required to generate a session secret." >&2
  exit 1
fi

if [ -z "${ADMIN_PASSWORD:-}" ]; then
  printf "Choose a production admin password: " >&2
  stty -echo
  IFS= read -r ADMIN_PASSWORD
  stty echo
  printf "\n" >&2
fi

if [ "${#ADMIN_PASSWORD}" -lt 16 ]; then
  echo "ADMIN_PASSWORD must contain at least 16 characters." >&2
  exit 1
fi

mkdir -p "$secrets_dir"
chmod 700 "$secrets_dir"

(umask 077 && printf "%s" "$ADMIN_PASSWORD" > "$secrets_dir/admin_password")
(umask 077 && openssl rand -hex 32 > "$secrets_dir/admin_session_secret")

printf "Secrets created outside the repository: %s\n" "$secrets_dir"
printf "export AUTOPILOT_SECRETS_DIR='%s'\n" "$secrets_dir"
