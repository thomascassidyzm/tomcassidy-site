#!/usr/bin/env bash
# Copy each look into its share folder (~/notemap-share/<token>/), self-contained:
# the page, the shared house style (site.css), the site's fonts, data and core.
# Tokens live in tokens.txt ("<direction> <token>" per line).
set -euo pipefail
cd "$(dirname "$0")"
while read -r dir tok; do
  [ -z "$dir" ] && continue
  out="$HOME/notemap-share/$tok"; mkdir -p "$out"
  cp "$dir"/* fonts/* data.js core.js "$out"/
  # the share door serves no .css files, so the house style is inlined
  python3 -c 'import sys; h=open(sys.argv[1]).read(); c=open("site.css").read(); open(sys.argv[2],"w").write(h.replace("<link rel=\"stylesheet\" href=\"site.css\">", "<style>\n"+c+"</style>"))' "$dir/index.html" "$out/index.html"
  echo "$dir -> https://watson-1.tail4968cb.ts.net:10000/nm/$tok/"
done < tokens.txt
