#!/bin/bash
# render-video.sh — Render a Remotion composition to MP4
#
# Usage: render-video.sh <entry-file> <composition-id> <output-path>
#
# Example:
#   render-video.sh /tmp/remotion-project/src/index.ts main /tmp/output.mp4

set -euo pipefail

ENTRY_FILE="${1:?Usage: render-video.sh <entry-file> <composition-id> <output-path>}"
COMPOSITION_ID="${2:?Missing composition ID}"
OUTPUT_PATH="${3:?Missing output path}"

# Ensure output directory exists
mkdir -p "$(dirname "${OUTPUT_PATH}")"

echo "Rendering video: ${COMPOSITION_ID} → ${OUTPUT_PATH}" >&2

cd "$(dirname "${ENTRY_FILE}")/.."

# Render with GL fallback: try angle-egl first, then swangle
render_with_gl() {
  npx remotion render \
    "${ENTRY_FILE}" \
    "${COMPOSITION_ID}" \
    "${OUTPUT_PATH}" \
    --gl="$1" \
    --codec=h264 \
    --crf=18 \
    --log=error \
    2>&1 >&2
}

if ! render_with_gl "angle-egl"; then
  echo "GL angle-egl failed, retrying with swangle..." >&2
  rm -f "${OUTPUT_PATH}"
  render_with_gl "swangle"
fi

if [ -f "${OUTPUT_PATH}" ] && [ -s "${OUTPUT_PATH}" ]; then
  FILE_SIZE=$(du -h "${OUTPUT_PATH}" | cut -f1)
  echo "Video rendered successfully: ${OUTPUT_PATH} (${FILE_SIZE})" >&2
  echo "${OUTPUT_PATH}"
else
  echo "Error: Render failed, output file not created or empty" >&2
  exit 1
fi
