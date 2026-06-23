#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/practice-app}"
RELEASE="${1:-2026-06-23}"

echo "Deploying release ${RELEASE} to ${APP_DIR}"
mkdir -p "${APP_DIR}/releases/${RELEASE}"
ln -sfn "${APP_DIR}/releases/${RELEASE}" "${APP_DIR}/current"
echo "Deployment complete"
