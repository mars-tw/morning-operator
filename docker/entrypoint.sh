#!/bin/sh
set -eu

load_secret() {
  variable_name="$1"
  file_path="$2"

  if [ -z "$file_path" ]; then
    return
  fi
  if [ ! -r "$file_path" ]; then
    echo "Secret file for ${variable_name} is not readable: ${file_path}" >&2
    exit 1
  fi

  secret_value="$(cat "$file_path")"
  if [ -z "$secret_value" ]; then
    echo "Secret file for ${variable_name} is empty: ${file_path}" >&2
    exit 1
  fi
  export "${variable_name}=${secret_value}"
}

umask 077

load_secret ADMIN_PASSWORD "${ADMIN_PASSWORD_FILE:-}"
load_secret ADMIN_SESSION_SECRET "${ADMIN_SESSION_SECRET_FILE:-}"
load_secret LEMON_SQUEEZY_WEBHOOK_SECRET "${LEMON_SQUEEZY_WEBHOOK_SECRET_FILE:-}"
load_secret RESEND_API_KEY "${RESEND_API_KEY_FILE:-}"

if [ "${NODE_ENV:-}" = "production" ]; then
  admin_password_value="${ADMIN_PASSWORD:-}"
  admin_session_secret_value="${ADMIN_SESSION_SECRET:-}"
  if [ "$admin_password_value" = "demo-only-change-me" ] || [ "${#admin_password_value}" -lt 14 ]; then
    echo "ADMIN_PASSWORD must be a non-demo value with at least 14 characters." >&2
    exit 1
  fi
  if [ "${#admin_session_secret_value}" -lt 32 ]; then
    echo "ADMIN_SESSION_SECRET must contain at least 32 characters." >&2
    exit 1
  fi
  case "${AUTOPILOT_BASE_URL:-}" in
    https://*|http://localhost*|http://127.0.0.1*) ;;
    *) echo "AUTOPILOT_BASE_URL must use HTTPS outside localhost." >&2; exit 1 ;;
  esac
  if [ "${NEXT_PUBLIC_DEMO_MODE:-true}" = "false" ] && [ -z "${NEXT_PUBLIC_CHECKOUT_URL:-}" ]; then
    echo "NEXT_PUBLIC_CHECKOUT_URL is required when demo mode is disabled." >&2
    exit 1
  fi
fi

mkdir -p /app/var/data /app/var/backups /app/var/workspaces

exec "$@"
