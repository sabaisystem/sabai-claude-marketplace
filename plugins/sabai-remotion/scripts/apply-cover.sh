#!/bin/bash
# apply-cover.sh — Apply cover to an existing MP4 (prepend 2s intro + embed thumbnail)
#
# Usage: apply-cover.sh <entry-file> <composition-id> <output-mp4> <cover-frame>
#
# This script applies both operations together:
# 1. Prepends the selected frame as a visible 2-second intro at the start
# 2. Embeds the same frame as the MP4 thumbnail metadata
#
# Failure policy: neither operation fails the pipeline; both fall back gracefully.

set -uo pipefail

ENTRY_FILE="${1:?Usage: apply-cover.sh <entry-file> <composition-id> <output-mp4> <cover-frame>}"
COMPOSITION_ID="${2:?Missing composition ID}"
OUTPUT_MP4="${3:?Missing output MP4 path}"
COVER_FRAME="${4:?Missing cover frame number}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Step 1: Prepend cover frame as visible 2s intro
bash "${SCRIPT_DIR}/prepend-cover-frame.sh" "${ENTRY_FILE}" "${COMPOSITION_ID}" "${OUTPUT_MP4}" "${COVER_FRAME}" || true

# Step 2: Embed the same frame as MP4 thumbnail metadata
bash "${SCRIPT_DIR}/embed-cover-art.sh" "${ENTRY_FILE}" "${COMPOSITION_ID}" "${OUTPUT_MP4}" "${COVER_FRAME}" || true

echo "Cover applied: frame ${COVER_FRAME} (intro + thumbnail) → ${OUTPUT_MP4}" >&2
