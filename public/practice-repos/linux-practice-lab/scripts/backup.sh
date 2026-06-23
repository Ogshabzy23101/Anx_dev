#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${SOURCE_DIR:-/opt/practice-app}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
STAMP="$(date +%F-%H%M%S)"

mkdir -p "${BACKUP_PATH}"
tar -czf "${BACKUP_DIR}/practice-app-${STAMP}.tar.gz" "${SOURCE_DIR}"
echo "Backup written to ${BACKUP_DIR}/practice-app-${STAMP}.tar.gz"
