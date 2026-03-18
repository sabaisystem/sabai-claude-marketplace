#!/bin/bash
# render-gif.sh — Render a Remotion composition as GIF for inline preview
#
# Usage: render-gif.sh <entry-file> <composition-id> <output-path>
#
# Example:
#   render-gif.sh /tmp/remotion-project/src/index.ts main /tmp/preview.gif
#
# Renders MP4 first, then converts to optimized GIF using ffmpeg.
# GIF is lower fps and resolution for smaller file size.

set -euo pipefail

ENTRY_FILE="${1:?Usage: render-gif.sh <entry-file> <composition-id> <output-path>}"
COMPOSITION_ID="${2:?Missing composition ID}"
OUTPUT_PATH="${3:?Missing output path}"

# Ensure output directory exists
mkdir -p "$(dirname "${OUTPUT_PATH}")"

# Temporary MP4 for conversion
TEMP_MP4="/tmp/gif-source-$$.mp4"

echo "Rendering GIF preview: ${COMPOSITION_ID}" >&2

# Step 1: Render MP4 with Remotion
cd "$(dirname "${ENTRY_FILE}")/.."
npx remotion render \
  "${ENTRY_FILE}" \
  "${COMPOSITION_ID}" \
  "${TEMP_MP4}" \
  --gl=angle-egl \
  --codec=h264 \
  --log=error \
  2>&1 >&2

if [ ! -f "${TEMP_MP4}" ]; then
  echo "Error: Video render failed" >&2
  exit 1
fi

# Step 2: Convert to optimized GIF using ffmpeg
# - Scale down to max 480px width for smaller file size
# - Use 15fps for GIF (smooth enough for preview)
# - Generate palette for better color quality
echo "Converting to GIF..." >&2

PALETTE="/tmp/gif-palette-$$.png"

# Generate palette
ffmpeg -y -i "${TEMP_MP4}" \
  -vf "fps=15,scale='min(480,iw)':-1:flags=lanczos,palettegen=stats_mode=diff" \
  "${PALETTE}" \
  -loglevel error 2>&1 >&2

# Generate GIF with palette
ffmpeg -y -i "${TEMP_MP4}" -i "${PALETTE}" \
  -lavfi "fps=15,scale='min(480,iw)':-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  "${OUTPUT_PATH}" \
  -loglevel error 2>&1 >&2

# Cleanup temp files
rm -f "${TEMP_MP4}" "${PALETTE}"

if [ -f "${OUTPUT_PATH}" ]; then
  FILE_SIZE=$(du -h "${OUTPUT_PATH}" | cut -f1)
  echo "GIF rendered: ${OUTPUT_PATH} (${FILE_SIZE})" >&2
  echo "${OUTPUT_PATH}"
else
  echo "Error: GIF conversion failed" >&2
  exit 1
fi
