#!/bin/bash
# render-carousel.sh — Render each frame as PNG and stitch into a PDF
#
# Usage: render-carousel.sh <entry-file> <composition-id> <num-slides> <output-pdf>
#
# Example:
#   render-carousel.sh /tmp/remotion-project/src/index.ts carousel 5 /tmp/carousel.pdf
#
# Each frame (0..num_slides-1) is rendered as a 1200×1500 PNG, then stitched into a single PDF.

set -euo pipefail

ENTRY_FILE="${1:?Usage: render-carousel.sh <entry-file> <composition-id> <num-slides> <output-pdf>}"
COMPOSITION_ID="${2:?Missing composition ID}"
NUM_SLIDES="${3:?Missing number of slides}"
OUTPUT_PDF="${4:?Missing output PDF path}"

# Ensure output directory exists
mkdir -p "$(dirname "${OUTPUT_PDF}")"

SLIDE_DIR="/tmp/carousel-slides"
rm -rf "${SLIDE_DIR}"
mkdir -p "${SLIDE_DIR}"

cd "$(dirname "${ENTRY_FILE}")/.."

echo "Rendering ${NUM_SLIDES} carousel slides..." >&2

# Render each frame as a PNG
for ((i=0; i<NUM_SLIDES; i++)); do
  SLIDE_PATH="${SLIDE_DIR}/slide-$(printf '%02d' ${i}).png"
  echo "  Rendering slide $((i+1))/${NUM_SLIDES}..." >&2
  npx remotion still \
    "${ENTRY_FILE}" \
    "${COMPOSITION_ID}" \
    "${SLIDE_PATH}" \
    --frame="${i}" \
    --gl=angle-egl \
    --log=error \
    2>&1 >&2
done

echo "Stitching slides into PDF..." >&2

# Stitch PNGs into PDF — try ImageMagick first, fall back to img2pdf
SLIDE_FILES=$(ls "${SLIDE_DIR}"/slide-*.png 2>/dev/null | sort)

if [ -z "${SLIDE_FILES}" ]; then
  echo "Error: No slide images were rendered" >&2
  exit 1
fi

if command -v magick &>/dev/null; then
  # ImageMagick 7+
  magick ${SLIDE_FILES} "${OUTPUT_PDF}"
elif command -v convert &>/dev/null; then
  # ImageMagick 6
  convert ${SLIDE_FILES} "${OUTPUT_PDF}"
elif command -v img2pdf &>/dev/null; then
  img2pdf ${SLIDE_FILES} -o "${OUTPUT_PDF}"
else
  echo "Error: No PDF tool found. Install ImageMagick (convert/magick) or img2pdf." >&2
  echo "Individual slides are at: ${SLIDE_DIR}/" >&2
  exit 1
fi

# Clean up slide PNGs
rm -rf "${SLIDE_DIR}"

if [ -f "${OUTPUT_PDF}" ]; then
  echo "Carousel PDF created: ${OUTPUT_PDF} (${NUM_SLIDES} slides)" >&2
  echo "${OUTPUT_PDF}"
else
  echo "Error: PDF creation failed" >&2
  exit 1
fi
