#!/bin/bash
# render-still.sh — Render a single frame as PNG for quick preview
#
# Usage: render-still.sh <entry-file> <composition-id> <frame-number> <output-path>
#
# Example:
#   render-still.sh /tmp/remotion-project/src/index.ts main 75 /tmp/preview.png

set -euo pipefail

ENTRY_FILE="${1:?Usage: render-still.sh <entry-file> <composition-id> <frame> <output-path>}"
COMPOSITION_ID="${2:?Missing composition ID}"
FRAME="${3:?Missing frame number}"
OUTPUT_PATH="${4:?Missing output path}"

# Ensure output directory exists
mkdir -p "$(dirname "${OUTPUT_PATH}")"

echo "Rendering still frame ${FRAME}: ${COMPOSITION_ID} → ${OUTPUT_PATH}" >&2

# Render single frame with Remotion CLI
cd "$(dirname "${ENTRY_FILE}")/.."
npx remotion still \
  "${ENTRY_FILE}" \
  "${COMPOSITION_ID}" \
  "${OUTPUT_PATH}" \
  --frame="${FRAME}" \
  --gl=angle-egl \
  --log=error \
  2>&1 >&2

if [ -f "${OUTPUT_PATH}" ]; then
  echo "Still frame rendered: ${OUTPUT_PATH}" >&2
  echo "${OUTPUT_PATH}"
else
  echo "Error: Still render failed, output file not created" >&2
  exit 1
fi
