#!/bin/bash
# render-scene-checks.sh — Render specific frames as PNGs for visual validation
#
# Usage: render-scene-checks.sh <entry-file> <composition-id> <frame-list> [output-dir]
#
# Example:
#   render-scene-checks.sh /tmp/remotion-project/src/index.ts main "0,59,120,239"
#
# <frame-list> is comma-separated frame numbers.
# Output files are named check-frame-NNNN.png (4-digit zero-padded).

set -euo pipefail

ENTRY_FILE="${1:?Usage: render-scene-checks.sh <entry-file> <composition-id> <frame-list> [output-dir]}"
COMPOSITION_ID="${2:?Missing composition ID}"
FRAME_LIST="${3:?Missing frame list (comma-separated, e.g. 0,59,120,239)}"
OUTPUT_DIR="${4:-/tmp/scene-checks}"

# Clean and prepare output directory
rm -rf "${OUTPUT_DIR}"
mkdir -p "${OUTPUT_DIR}"

cd "$(dirname "${ENTRY_FILE}")/.."

# Render a single frame with GL fallback
render_frame_with_gl() {
  local out_path="$1"
  local frame_num="$2"
  local gl_flag="$3"
  npx remotion still \
    "${ENTRY_FILE}" \
    "${COMPOSITION_ID}" \
    "${out_path}" \
    --frame="${frame_num}" \
    --gl="${gl_flag}" \
    --log=error \
    2>&1 >&2
}

IFS=',' read -ra FRAMES <<< "${FRAME_LIST}"
TOTAL=${#FRAMES[@]}
FAILED=0

echo "Rendering ${TOTAL} check frames..." >&2

for frame in "${FRAMES[@]}"; do
  PADDED=$(printf '%04d' "${frame}")
  OUT_PATH="${OUTPUT_DIR}/check-frame-${PADDED}.png"
  echo "  Frame ${frame}..." >&2
  if ! render_frame_with_gl "${OUT_PATH}" "${frame}" "angle-egl"; then
    echo "  GL angle-egl failed for frame ${frame}, retrying with swangle..." >&2
    rm -f "${OUT_PATH}"
    if ! render_frame_with_gl "${OUT_PATH}" "${frame}" "swangle"; then
      echo "  Error: Failed to render frame ${frame}" >&2
      FAILED=$((FAILED + 1))
      continue
    fi
  fi
  if [ ! -f "${OUT_PATH}" ] || [ ! -s "${OUT_PATH}" ]; then
    echo "  Error: Frame ${frame} produced empty output" >&2
    FAILED=$((FAILED + 1))
    continue
  fi
  echo "${OUT_PATH}"
done

if [ "${FAILED}" -gt 0 ]; then
  echo "Error: ${FAILED}/${TOTAL} frames failed to render" >&2
  exit 1
fi

echo "All ${TOTAL} check frames rendered to ${OUTPUT_DIR}/" >&2
