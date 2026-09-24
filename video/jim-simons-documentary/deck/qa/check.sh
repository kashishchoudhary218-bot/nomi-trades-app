#!/bin/sh
# Builds the deck with real and wide fallback fonts, validates, renders, and checks overlaps.
set -e
cd "$(dirname "$0")/.."
SK=${SK:-/root/.claude/skills/synced/90383185-2615-4309-bb6c-b75b2c8e385a_d21b980b-b54f-4eff-8c3c-f5592823100e/pptx}
npm run -s build && DECK_WIDE_FONTS=1 npm run -s build
python3 $SK/scripts/office/validate.py The-Mathematicians-Edge-Hinglish.pptx | tail -1
timeout 280 python3 $SK/scripts/office/soffice.py --headless --convert-to pdf --outdir "$PWD" "$PWD/The-Mathematicians-Edge-Hinglish.pptx" >/dev/null 2>&1
timeout 280 python3 $SK/scripts/office/soffice.py --headless --convert-to pdf --outdir "$PWD/qa" "$PWD/qa/wide-fonts.pptx" >/dev/null 2>&1
echo "== real fonts"; python3 -W ignore qa/overlap_check.py The-Mathematicians-Edge-Hinglish.pdf
echo "== wide fallback fonts"; python3 -W ignore qa/overlap_check.py qa/wide-fonts.pdf
