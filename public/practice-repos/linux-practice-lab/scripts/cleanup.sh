#!/usr/bin/env bash

TARGET_DIR="${1:-./tmp}"
DAYS="${DAYS:-7}"

echo "Removing files older than ${DAYS} days from ${TARGET_DIR}"
find "${TARGET_DIR}" -type f -mtime +"${DAYS}" -print
# Intentionally dry-run only. Add -delete after reviewing output.
