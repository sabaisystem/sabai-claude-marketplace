#!/bin/bash
# prepend-cover-frame.sh — Prepend a cover image as a visible first frame of the video
#
# Usage: prepend-cover-frame.sh <entry-file> <composition-id> <output-mp4> <cover-frame> [duration-seconds]
#
# Arguments:
#   cover-frame       Frame number to use as cover (selected by AI)
#   duration-seconds  How long the cover frame is shown (default: 2 seconds)
#
# Notes:
# - Cover source: AI-selected frame number passed as argument
# - Duration: how long the cover frame is shown (default: 2 seconds)
# - Failure policy: this script never fails the overall pipeline; it falls back gracefully.

set -uo pipefail

ENTRY_FILE="${1:?Usage: prepend-cover-frame.sh <entry-file> <composition-id> <output-mp4> <cover-frame> [duration-seconds]}"
COMPOSITION_ID="${2:?Missing composition ID}"
OUTPUT_MP4="${3:?Missing output MP4 path}"
COVER_FRAME="${4:?Missing cover frame number}"
COVER_DURATION="${5:-2}"

if [ ! -f "${OUTPUT_MP4}" ] || [ ! -s "${OUTPUT_MP4}" ]; then
  echo "Warning: prepend-cover-frame: output MP4 missing/empty (${OUTPUT_MP4})" >&2
  exit 0
fi

if ! command -v ffmpeg &>/dev/null; then
  echo "Warning: prepend-cover-frame: ffmpeg not found, skipping cover prepend" >&2
  exit 0
fi

if [ ! -f "${ENTRY_FILE}" ]; then
  echo "Warning: prepend-cover-frame: entry file not found (${ENTRY_FILE}), skipping" >&2
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RENDER_STILL_SH="${SCRIPT_DIR}/render-still.sh"
if [ ! -x "${RENDER_STILL_SH}" ]; then
  echo "Warning: prepend-cover-frame: render-still.sh not found/executable, skipping" >&2
  exit 0
fi

COVER_PNG="/tmp/remotion-cover-intro-$$.png"
COVER_MP4="/tmp/remotion-cover-intro-$$.mp4"
TMP_CONCAT="/tmp/remotion-concat-$$.txt"
TMP_OUT="${OUTPUT_MP4}.prepend_tmp.$$"

cleanup() {
  rm -f "${COVER_PNG}" "${COVER_MP4}" "${TMP_CONCAT}" "${TMP_OUT}" 2>/dev/null || true
}
trap cleanup EXIT

echo "Prepending cover frame: frame ${COVER_FRAME} for ${COVER_DURATION}s (${COMPOSITION_ID})" >&2

# Step 1: Render the selected frame as PNG
if ! bash "${RENDER_STILL_SH}" "${ENTRY_FILE}" "${COMPOSITION_ID}" "${COVER_FRAME}" "${COVER_PNG}"; then
  echo "Warning: prepend-cover-frame: still render failed, skipping cover prepend" >&2
  exit 0
fi

if [ ! -f "${COVER_PNG}" ] || [ ! -s "${COVER_PNG}" ]; then
  echo "Warning: prepend-cover-frame: cover PNG missing/empty, skipping" >&2
  exit 0
fi

# Step 2: Get video properties (fps, resolution) from the original MP4
VIDEO_FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "${OUTPUT_MP4}" 2>/dev/null | head -1)
VIDEO_WIDTH=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "${OUTPUT_MP4}" 2>/dev/null | head -1)
VIDEO_HEIGHT=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "${OUTPUT_MP4}" 2>/dev/null | head -1)

if [ -z "${VIDEO_FPS}" ] || [ -z "${VIDEO_WIDTH}" ] || [ -z "${VIDEO_HEIGHT}" ]; then
  echo "Warning: prepend-cover-frame: couldn't read video properties, skipping" >&2
  exit 0
fi

# Step 3: Create a short video from the cover image matching the original video's properties
if ! ffmpeg -y -hide_banner -loglevel error \
  -loop 1 -i "${COVER_PNG}" \
  -t "${COVER_DURATION}" \
  -vf "scale=${VIDEO_WIDTH}:${VIDEO_HEIGHT}:flags=lanczos" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p \
  -r "${VIDEO_FPS}" \
  "${COVER_MP4}"; then
  echo "Warning: prepend-cover-frame: cover video creation failed, skipping" >&2
  exit 0
fi

if [ ! -f "${COVER_MP4}" ] || [ ! -s "${COVER_MP4}" ]; then
  echo "Warning: prepend-cover-frame: cover video missing/empty, skipping" >&2
  exit 0
fi

# Step 4: Concatenate cover video + original video
cat > "${TMP_CONCAT}" << EOF
file '${COVER_MP4}'
file '${OUTPUT_MP4}'
EOF

if ! ffmpeg -y -hide_banner -loglevel error \
  -f concat -safe 0 -i "${TMP_CONCAT}" \
  -c copy \
  "${TMP_OUT}"; then
  echo "Warning: prepend-cover-frame: concat failed, skipping cover prepend" >&2
  exit 0
fi

if [ ! -f "${TMP_OUT}" ] || [ ! -s "${TMP_OUT}" ]; then
  echo "Warning: prepend-cover-frame: concat output missing/empty, skipping" >&2
  exit 0
fi

mv "${TMP_OUT}" "${OUTPUT_MP4}"
echo "Cover frame prepended successfully: ${COVER_DURATION}s intro (frame ${COVER_FRAME}) added to ${OUTPUT_MP4}" >&2
