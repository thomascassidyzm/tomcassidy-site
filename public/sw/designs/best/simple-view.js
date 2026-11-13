// template=smartbook: Jonathan Kemp's SmartBook 250DG map page (first taken for the simple template; see docs/DECISIONS.md) with EVERY possible note line on it.
// Lines only: nothing is seated here (Tom 2026-11-13: "we probably need all possible lines mapped out to the pixel and then
// have the run-time choose which combination of the lines at each juncture is most suitable for the text as it comes along").
// The lines are template/simple/simple-network.json, cut from the template image's own dashes by tools/simple-network.py.
// URL: ?template=smartbook &theme=dark|light &paper=white|cream|grey &guides=1 (centre lines of the runs, thin, on top)
//      &lines=0 (the template alone, nothing drawn on it) &thin=1 (hairlines and small dots, so the template's own dashes show either side: the proof view) &junctions=0 (hide the dots) &zoom=1..6 &fx=&fy= (zoom centre, 0..1 of the sheet) &seg=s07 (show one segment and what it can carry on into)
(function (root) {
  "use strict";
  const PAPERS = ["white", "cream", "grey"];
  const COL = { dark: ["#9aa7b2", "#4fd0f0", "#6fd28d", "#f2bd4e"], light: ["#6d7882", "#0b8fd6", "#1f8f47", "#b97f00"] };
  const NAMES = ["star", "ring 1 to 2", "ring 2 to 3", "beyond ring 3"];
  function run(qs) {
    const S = { theme: qs.theme === "light" ? "light" : "dark", paper: PAPERS.indexOf(qs.paper) >= 0 ? qs.paper : "white", guides: qs.guides === "1", junctions: qs.junctions !== "0", lines: qs.lines !== "0", thin: qs.thin === "1",
      zoom: Math.max(1, Math.min(6, parseFloat(qs.zoom) || 1)), fx: qs.fx != null ? parseFloat(qs.fx) : .5, fy: qs.fy != null ? parseFloat(qs.fy) : .5, seg: qs.seg || "" };
    const $ = id => document.getElementById(id), tpl = $("tpl"), ink = $("ink"), sheet = $("sheet"), view = $("view"), leg = $("legend");
    let T = null, W = 2381, H = 1684;
    const pushUrl = () => { const p = ["template=smartbook", "theme=" + S.theme]; if (S.paper !== "white") p.push("paper=" + S.paper); p.push("text=off"); if (S.guides) p.push("guides=1"); if (!S.junctions) p.push("junctions=0"); if (!S.lines) p.push("lines=0"); if (S.thin) p.push("thin=1"); if (S.zoom > 1) p.push("zoom=" + S.zoom, "fx=" + S.fx.toFixed(3), "fy=" + S.fy.toFixed(3)); if (S.seg) p.push("seg=" + S.seg); try { history.replaceState(null, "", location.pathname + "?" + p.join("&")); } catch (e) {} };
    function fit() { const vw = view.clientWidth, vh = view.clientHeight, s = Math.min(vw / W, vh / H) * S.zoom, w = W * s, h = H * s;
      sheet.style.cssText = "width:" + w + "px;height:" + h + "px;margin-left:" + Math.max(0, (vw - w) / 2) + "px;margin-top:" + Math.max(0, (vh - h) / 2) + "px";
      if (S.zoom > 1) { view.scrollLeft = S.fx * w - vw / 2; view.scrollTop = S.fy * h - vh / 2; } return s; }
    function render() {
      document.body.className = S.theme + " simple" + (S.thin ? " thin" : "") + (S.theme === "light" && S.paper !== "white" ? " paper-" + S.paper : "");
      const scale = fit(), N = T.network, col = COL[S.theme], bi = b => N.bands.indexOf(b), by = {}; N.segments.forEach(s => { by[s.id] = s; });
      const pick = S.seg && by[S.seg] ? by[S.seg] : null, nextOf = pick ? pick.next.a.concat(pick.next.b) : [];
      const op = s => !pick ? "" : s === pick ? ' style="opacity:1"' : nextOf.indexOf(s.id) >= 0 ? ' style="opacity:.8"' : ' style="opacity:.12"';
      ink.innerHTML = !S.lines ? "" : N.segments.map(s => '<path class="sg b' + bi(s.band) + '" data-id="' + s.id + '" stroke="' + col[bi(s.band)] + '"' + op(s) + ' d="' + s.d + '"/>').join("")
        + (S.guides ? T.geometry.guides.map(g => '<path class="gd" d="' + g.d + '"/>').join("") : "")
        + (S.junctions ? N.junctions.map(j => '<circle class="jn" data-id="' + j.id + '" cx="' + j.pt[0] + '" cy="' + j.pt[1] + '" r="' + (S.thin ? 1.5 : j.kind === "end" ? 3.2 : 4.2) + '" fill="' + (j.kind === "end" ? "#ff9a86" : S.theme === "dark" ? "#ffffff" : "#18242c") + '"/>').join("") : "");
      const c = N.counts, k = N.check;
      leg.innerHTML = "<span>smartbook page &middot; " + c.note_lines + " note lines + " + c.star_lines + " star lines &middot; " + c.junctions + " junctions</span>"
        + N.bands.map((b, i) => '<span><i style="border-top-color:' + col[i] + '"></i>' + NAMES[i] + " " + c.bands[b].segments + " &middot; " + Math.round(c.bands[b].len_pt) + " pt</span>").join("")
        + "<span>dash to line max " + k.dash_centre_to_line.max + " px, p99 " + k.dash_centre_to_line.p99 + "</span>" + (pick ? "<b>" + pick.id + " " + pick.len_pt + " pt &rarr; " + (nextOf.join(" ") || "nothing") + "</b>" : "");
      $("bTheme").textContent = S.theme; const bp = $("bPaper"); bp.textContent = S.paper; bp.hidden = S.theme !== "light";
      $("bText").textContent = "guides"; $("bText").className = S.guides ? "on" : ""; $("bLat").textContent = "dots"; $("bLat").className = S.junctions ? "on" : ""; $("bZoom").className = S.zoom > 1 ? "on" : "";
      root.__notemap = { template: "smartbook", mode: "lines", scale: +scale.toFixed(3), segments: c.segments, junctions: c.junctions, bands: c.bands, check: k };
    }
    ["bSet", "bComp", "bPlay"].forEach(id => { $(id).hidden = true; });
    const on = (id, f) => $(id).addEventListener("click", () => { f(); pushUrl(); render(); });
    on("bTheme", () => { S.theme = S.theme === "dark" ? "light" : "dark"; });
    on("bPaper", () => { S.paper = PAPERS[(PAPERS.indexOf(S.paper) + 1) % PAPERS.length]; });
    on("bText", () => { S.guides = !S.guides; });
    on("bLat", () => { S.junctions = !S.junctions; });
    on("bZoom", () => { if (S.zoom > 1) S.zoom = 1; else { S.zoom = 2.4; S.fx = .47; S.fy = .5; } });
    sheet.addEventListener("dblclick", e => { const r = sheet.getBoundingClientRect(); if (S.zoom > 1) S.zoom = 1; else { S.zoom = 2.4; S.fx = (e.clientX - r.left) / r.width; S.fy = (e.clientY - r.top) / r.height; } pushUrl(); render(); });
    ink.addEventListener("click", e => { const id = e.target && e.target.getAttribute && e.target.getAttribute("data-id"); S.seg = id && /^s/.test(id) && id !== S.seg ? id : ""; pushUrl(); render(); });
    let rz = 0; root.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(render, 120); });
    root.SmartWisdomTemplate.loadSimple().then(t => { T = t; W = t.geometry.page.w; H = t.geometry.page.h;
      [tpl, ink].forEach(el => el.setAttribute("viewBox", "0 0 " + W + " " + H)); t.mount(tpl); ink.style.pointerEvents = "auto"; pushUrl(); render();
    }).catch(e => { leg.innerHTML = "<b>the simple template needs the page served over http (" + (e && e.message || e) + ")</b>"; });
  }
  root.SimpleView = { run };
})(window);
