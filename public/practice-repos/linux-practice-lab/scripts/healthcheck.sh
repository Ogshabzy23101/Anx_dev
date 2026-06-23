#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://localhost:8080/health}"

if curl -fsS "${URL}" > /dev/null; then
  echo "ok ${URL}"
else
  echo "failed ${URL}" >&2
  exit 1
fi
