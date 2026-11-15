#!/usr/bin/env bash
# Copy each look into its share folder (~/notemap-share/<token>/), self-contained.
# Tokens live in tokens.txt (direction token), one per line.
set -euo pipefail
cd "$(dirname "$0")"
while read -r dir tok; do
  [ -z "$dir" ] && continue
  out="$HOME/notemap-share/$tok"; mkdir -p "$out"
  cp "$dir"/* data.js core.js "$out"/
  echo "$dir -> https://watson-1.tail4968cb.ts.net:10000/nm/$tok/"
done < tokens.txt
