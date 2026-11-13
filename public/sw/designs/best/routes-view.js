// routes=printed|proposal|lengths: the template's note guides as ROUTES (template/routes.json, made by tools/template-routes.py).
// Lines only, no text. Works on either edge set: template=simple|business (the centre is the same vector).
//   printed  : the seven printed guides, each one continuous route, with its marks (star tip, ring crossings, elbows, end)
//   proposal : the same, plus the PROPOSED continued guides in a second colour (not on the template): every star tip carries one
//   lengths  : how a route is cut to length. Inside ring 3 a line runs ring to ring, so they are all much the same length;
//              beyond ring 3 the length follows the words: three lengths are shown cut from ONE route, from the same start.
//   ud       : Jonathan Kemp's U/D codes against the guides (docs/KEMP-UD-CODES.md). A drawn line IS the printed guide (Tom, on the
//              arches #597 added: "the guides are there though? and these new arches don't match them"). Every PRINTED route is drawn
//              exactly on its guide and coloured stretch by stretch by its OWN measured curvature (routes.json stretch.measured):
//              amber = hump, green = bowl, grey = straight. The page measures each drawn stretch against the mounted guide element
//              in screen pixels and prints the figure. The codes shape a line only where nothing is printed (dashed, lighter):
//              the three star-tip continuations and the four corner continuations past the ends of the long guides, built from
//              the MODEL ARCH (routes.json ud.model: the mean of the printed arcs, scaled to the chord). ud=by-side|by-half (side|half) changes ONLY those; with none, the stored ud.rule.
//              guides=1 lays the template's own guide paths on top, thin; one=<route id> draws a single route.
//              RING JUNCTIONS ARE SNAPPED (Tom: the dots "are not totally aligned with ... the Edges of the concentric circles"; docs/RING-JUNCTIONS.md):
//              the offsets are printed (the 1:30 guide's elbows are drawn 1.06 and 2.12 pt outside rings 2 and 3), so under his tidy ruling a
//              junction is drawn ON its ring (mark.snap) and each stretch ending there is the printed stretch turned and scaled about its own ends
//              onto the new ends (stretch.fit). The switchbacks' 12 step ends (printed 2-5 pt outside) go on their rings too: steps=ring, the default
//              (Tom, 2026-11-13, #696); steps=printed leaves them where printed (stretch.fit_steps_printed).
//              dots=1|0: a dot at EVERY junction of every drawn route, one size, or none. Default on.
// A stroke is route.slice(s0, s0 + L): L = letters x capital height x charW + a margin each end (the approved lettering's numbers).
(function (root) {
  "use strict";
  const MODES = ["printed", "proposal", "lengths", "ud"], UDALIAS = { side: "by-side", half: "by-half" }, PAPERS = ["white", "cream", "grey"], W = 612, H = 432.8739;
  const CAP3 = 3.82, CHARW = 1.056, LEAD = 4.2;                               // level-3 capital height, advance per letter, margin each end: lattice.js K
  const lenFor = n => 2 * LEAD + n * CAP3 * CHARW;
  function run(qs, edges) {
    const S = { mode: MODES.indexOf(qs.routes) >= 0 ? qs.routes : "printed", theme: qs.theme === "light" ? "light" : "dark", paper: PAPERS.indexOf(qs.paper) >= 0 ? qs.paper : "white",
      zoom: Math.max(1, Math.min(6, parseFloat(qs.zoom) || 1)), fx: qs.fx != null ? parseFloat(qs.fx) : .5, fy: qs.fy != null ? parseFloat(qs.fy) : .5, dots: qs.dots !== "0", steps: qs.snap === "rings" || (qs.snap == null && qs.steps === "ring"), asPrinted: qs.snap === "printed",   // snap=: default = step ends as printed, crossings on the rings (Tom 2026-11-13: the printed step ends are Jonathan's, deliberate); printed = exactly the PDF; rings = all on the rings
      ud: UDALIAS[qs.ud] || qs.ud || "", one: qs.one || "", guides: qs.guides === "1" };   // ud=unset|by-half|by-side: try a U/D rule on screen (the stored one is routes.json ud.rule)
    const $ = id => document.getElementById(id), tpl = $("tpl"), ink = $("ink"), sheet = $("sheet"), view = $("view"), leg = $("legend");
    let R = null, gk = null;   // gk: the on-guide measurement, taken once per size (the theme and the rule do not move a printed line)
    const pushUrl = () => { const p = []; if (edges === "simple") p.push("template=simple"); p.push("routes=" + S.mode, "theme=" + S.theme); if (S.paper !== "white") p.push("paper=" + S.paper); if (!S.dots) p.push("dots=0"); if (S.steps) p.push("snap=rings"); if (S.asPrinted) p.push("snap=printed"); if (S.ud) p.push("ud=" + S.ud); if (S.one) p.push("one=" + S.one); if (S.guides) p.push("guides=1"); if (S.zoom > 1) p.push("zoom=" + S.zoom, "fx=" + S.fx.toFixed(3), "fy=" + S.fy.toFixed(3)); try { history.replaceState(null, "", location.pathname + "?" + p.join("&")); } catch (e) {} };
    function fit() { const vw = view.clientWidth, vh = view.clientHeight, s = Math.min(vw / W, vh / H) * S.zoom, w = W * s, h = H * s;
      sheet.style.cssText = "width:" + w + "px;height:" + h + "px;margin-left:" + Math.max(0, (vw - w) / 2) + "px;margin-top:" + Math.max(0, (vh - h) / 2) + "px";
      if (S.zoom > 1) { view.scrollLeft = S.fx * w - vw / 2; view.scrollTop = S.fy * h - vh / 2; } return s; }
    // the stretch of a route from distance a to distance b along it, as a path
    function cut(r, a, b, fit) { const P = r.pts, cum = r.cum, at = s => { let i = 1; while (i < cum.length - 1 && cum[i] < s) i++; const t = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1); return [P[i - 1][0] + (P[i][0] - P[i - 1][0]) * t, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * t]; };
      const o = [at(a)]; for (let i = 0; i < P.length; i++) if (cum[i] > a && cum[i] < b) o.push(P[i]); o.push(at(b));
      if (fit) { const A = o[0], B = o[o.length - 1], ux = B[0] - A[0], uy = B[1] - A[1], vx = fit[2] - fit[0], vy = fit[3] - fit[1], n = ux * ux + uy * uy || 1, re = (vx * ux + vy * uy) / n, im = (vy * ux - vx * uy) / n;   // one similarity: old ends -> new ends
        for (let i = 0; i < o.length; i++) { const x = o[i][0] - A[0], y = o[i][1] - A[1]; o[i] = [fit[0] + x * re - y * im, fit[1] + x * im + y * re]; } o[o.length - 1] = [fit[2], fit[3]]; }
      return { d: "M" + o.map(p => p[0].toFixed(3) + " " + p[1].toFixed(3)).join("L"), end: o[o.length - 1], prev: o[o.length - 2] }; }
    // the drawn printed stretches against the template's own mounted guide elements, in screen pixels
    function onGuide() { const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), all = [], asPrinted = [], miss = []; let worst = { px: 0, id: "" }; const gc = {};
      const toScreen = (el, n) => { const m = el.getScreenCTM(), L = el.getTotalLength(), o = []; for (let i = 0; i <= n; i++) { const q = el.getPointAtLength(L * i / n); o.push([m.a * q.x + m.c * q.y + m.e, m.b * q.x + m.d * q.y + m.f]); } return o; };
      ink.querySelectorAll("path[data-guide]").forEach(el => { const gid = el.getAttribute("data-guide"), g = tpl.querySelector('[id="' + gid + '"]'); if (!g) { miss.push(gid); return; }
        const gp = gc[gid] || (gc[gid] = toScreen(g, Math.ceil(g.getTotalLength() * 14)));
        toScreen(el, 24).forEach(p => { let d = 1e9; for (let i = 1; i < gp.length; i++) { const ax = gp[i - 1][0], ay = gp[i - 1][1], bx = gp[i][0] - ax, by = gp[i][1] - ay, t = clamp(((p[0] - ax) * bx + (p[1] - ay) * by) / (bx * bx + by * by || 1e-9), 0, 1), e = Math.hypot(p[0] - ax - bx * t, p[1] - ay - by * t); if (e < d) d = e; }
          all.push(d); if (!el.hasAttribute("data-fit")) asPrinted.push(d); if (d > worst.px) worst = { px: +d.toFixed(4), id: el.getAttribute("data-id") }; }); });
      const max = all.length ? Math.max.apply(null, all) : NaN, maxP = asPrinted.length ? Math.max.apply(null, asPrinted) : 0, sc = ink.getScreenCTM().a, lim = (S.steps ? R.tidy.step_end_max_off_ring_pt : R.tidy.crossing_max_off_ring_pt) + .05;
      // a stretch nothing moved must sit ON its guide; a stretch fitted to a snapped junction may be off it by no more than the junction moved
      return { ok: !miss.length && maxP <= .1 * S.zoom && max <= lim * sc + .1 * S.zoom, maxPx: +max.toFixed(4), maxPt: +(max / sc).toFixed(3), asPrintedMaxPx: +maxP.toFixed(4), limitPt: +lim.toFixed(3), fitted: ink.querySelectorAll("path[data-fit]").length, samples: all.length, stretches: ink.querySelectorAll("path[data-guide]").length, worst, missing: miss }; }
    const tick = (c, col) => { const dx = c.end[0] - c.prev[0], dy = c.end[1] - c.prev[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l * 2.2, ny = dx / l * 2.2; return '<path d="M' + (c.end[0] - nx) + " " + (c.end[1] - ny) + "L" + (c.end[0] + nx) + " " + (c.end[1] + ny) + '" fill="none" stroke="' + col + '" stroke-width=".5"/>'; };
    function render() {
      document.body.className = S.theme + (S.theme === "light" && S.paper !== "white" ? " paper-" + S.paper : ""); const scale = fit();
      const cs = getComputedStyle(document.body), INK = cs.getPropertyValue("--ink").trim(), INK2 = cs.getPropertyValue("--ink2").trim(), dark = S.theme === "dark";
      const bw = b => [.55, .94, .79, .68][R.bands.indexOf(b)], h = [], dot = (m, col, pt) => '<circle cx="' + (pt || m.pt)[0] + '" cy="' + (pt || m.pt)[1] + '" r="1" fill="' + col + '" stroke="var(--bg)" stroke-width=".25"/>';
      const printed = R.routes.filter(r => r.source === "printed"), cont = R.routes.filter(r => r.source === "continued" && r.kind === "tip"); let legend = "";
      if (S.mode === "ud") {
        const rule = R.ud.table[S.ud] ? S.ud : R.ud.rule, UDC = { U: dark ? "#f2bd4e" : "#b97f00", D: dark ? "#6fd28d" : "#1f8f47", straight: "#8b96a0" }, tally = { printed: { U: 0, D: 0, straight: 0 }, continued: { U: 0, D: 0, none: 0 } }, dots = {}, MOVE = 1e-3;
        const fitOf = s => { if (S.asPrinted) return null; const f = S.steps || !("fit_steps_printed" in s) ? s.fit : s.fit_steps_printed; return f || null; }, at = m => (S.asPrinted || (!S.steps && m.step_off_ring != null) ? m.pt : m.snap || m.pt);
        R.routes.filter(r => !S.one || r.id === S.one).forEach(r => {
          if (r.source === "printed") r.stretches.forEach((s, n) => { tally.printed[s.measured]++;      // the guide itself, coloured by what it measures
            h.push('<path data-guide="' + r.id + '" data-id="' + r.id + "/" + n + '"' + (fitOf(s) ? " data-fit" : "") + ' d="' + cut(r, s.s0, s.s1, fitOf(s)).d + '" fill="none" stroke="' + UDC[s.measured] + '" stroke-width="' + (bw(s.band) + .25) + '" stroke-linecap="round" stroke-linejoin="round"/>'); });
          else { let drawn = false; const u = r.ud[rule], q = r.variants ? Object.assign({}, r, { pts: r.variants[u || "U"] }) : r;      // nothing printed here: the code shapes it
            if (r.variants) { q.cum = [0]; for (let i = 1; i < q.pts.length; i++) q.cum.push(q.cum[i - 1] + Math.hypot(q.pts[i][0] - q.pts[i - 1][0], q.pts[i][1] - q.pts[i - 1][1])); }
            r.stretches.forEach(s => { const c = r.variants ? u : s.measured; tally.continued[c || "none"]++; if (!c) return; drawn = true;
              h.push('<path d="' + cut(q, s.s0, s.s1, r.variants ? null : fitOf(s)).d + '" fill="none" stroke="' + UDC[c] + '" stroke-width="' + (bw(s.band) + .1) + '" stroke-linecap="butt" stroke-linejoin="round" stroke-dasharray="3.2 2" opacity=".6"/>'); });
            if (!drawn) return; }
          r.marks.forEach(m => { const p = at(m); dots[p[0].toFixed(1) + " " + p[1].toFixed(1)] = [m, p]; }); });      // every junction of every drawn route, once
        if (S.dots) Object.keys(dots).forEach(k => h.push(dot(dots[k][0], dark ? "#ffffff" : "#18242c", dots[k][1])));      // after the lines, so no line covers a dot
        root.__udDots = Object.keys(dots).length;
        legend = "<span><i style='border-top-color:" + UDC.U + "'></i>hump</span><span><i style='border-top-color:" + UDC.D + "'></i>bowl</span><span><i style='border-top-color:" + UDC.straight + "'></i>straight</span><span>dashed: continued, " + rule.replace("-", " ") + "</span>";
        root.__ud = { rule, tally, dots: S.dots ? root.__udDots : 0, junctions: root.__udDots, steps: S.asPrinted ? "all printed" : S.steps ? "ring" : "printed" };
      } else if (S.mode !== "lengths") {
        const show = S.mode === "proposal" ? printed.concat(cont) : printed;
        const rule = S.ud && R.ud.table[S.ud] ? S.ud : "", UDC = { U: dark ? "#f2bd4e" : "#b97f00", D: dark ? "#6fd28d" : "#1f8f47" };
        show.forEach(r => { const base = r.source === "printed" ? INK : INK2; r.stretches.forEach(s => { const outer = rule && s.band === "beyond-ring3", u = outer ? r.ud[rule] : "x", col = outer ? (u ? UDC[u] : "#8b96a0") : base; h.push('<path d="' + cut(r, s.s0, s.s1).d + '" fill="none" stroke="' + col + '" stroke-width="' + bw(s.band) + '" stroke-linecap="round" stroke-linejoin="round" opacity=".7"' + (outer && !u ? ' stroke-dasharray="1.2 1.6"' : "") + '/>'); });
          if (S.dots) r.marks.forEach(m => h.push(dot(m, base))); });
        if (rule) legend = "<b>U/D rule on trial: " + rule + "</b><span><i style='border-top-color:" + UDC.U + "'></i>U, humps</span><span><i style='border-top-color:" + UDC.D + "'></i>D, bowls</span>" + (rule === "unset" ? "<span><i class='k1' style='border-top-color:#8b96a0'></i>no printed code: with Tom</span>" : "") + "<span>beyond ring 3 only; at a fork the upper arm starts U, the lower D</span>"; else
        legend = S.mode === "proposal"
          ? "<b>proposal, for your eye</b><span><i style='border-top-color:" + INK + "'></i>" + printed.length + " printed guides</span><span><i style='border-top-color:" + INK2 + "'></i>" + cont.length + " continued, not on the template: the 1:30 guide turned to the other star tips</span>"
          : "<span><i style='border-top-color:" + INK + "'></i>" + printed.length + " printed guides as routes &middot; " + R.routes.filter(r => r.source === "printed").reduce((a, r) => a + r.marks.length, 0) + " marks &middot; on the template's own paths to " + R.check.printed_route_to_template_path_max_pt.toFixed(3) + " pt</span>";
      } else {
        const U = R.uniform, c3 = dark ? ["#ffffff", "#6fd28d", "#f2bd4e"] : ["#18242c", "#1f8f47", "#b97f00"], ns = [3, 7, 12];
        let best = null; printed.forEach(r => r.stretches.forEach(s => { if (s.band === "beyond-ring3" && (!best || s.len > best.s.len)) best = { r, s }; }));
        printed.forEach(r => r.stretches.forEach(s => { if (best && s === best.s) return; const inner = s.band !== "beyond-ring3", line = s.kind === "line";
          h.push('<path d="' + cut(r, s.s0, s.s1).d + '" fill="none" stroke="' + INK + '" stroke-width="' + (inner && line ? bw(s.band) : .3) + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + (inner && line ? .8 : .45) + '"/>'); }));
        if (S.dots) printed.forEach(r => r.marks.forEach(m => { if (m.kind === "ring" || m.kind === "tip" || m.ring) h.push(dot(m, INK)); }));
        if (best) { h.push('<path d="' + cut(best.r, best.s.s0, best.s.s1).d + '" fill="none" stroke="' + INK + '" stroke-width=".3" opacity=".45"/>');
          ns.slice().reverse().forEach((n, k) => { const i = ns.length - 1 - k, L = Math.min(lenFor(n), best.s.len), c = cut(best.r, best.s.s0, best.s.s0 + L);
            h.push('<path d="' + c.d + '" fill="none" stroke="' + c3[i] + '" stroke-width="' + [.7, 1.5, 2.4][i] + '" stroke-linecap="butt" stroke-linejoin="round"/>' + tick(c, c3[i])); }); }
        legend = "<span><i style='border-top-color:" + INK + "'></i>ring to ring: " + U["ring1-ring2"].min.toFixed(0) + "&ndash;" + U["ring1-ring2"].max.toFixed(0) + " pt and " + U["ring2-ring3"].min.toFixed(0) + "&ndash;" + U["ring2-ring3"].max.toFixed(0) + " pt</span>"
          + ns.map((n, i) => "<span><i style='border-top-color:" + c3[i] + "'></i>" + n + " letters " + lenFor(n).toFixed(0) + " pt</span>").join("") + "<span>one route, three lengths</span>";
      }
      ink.innerHTML = h.join("");
      if (S.guides) tpl.querySelectorAll('[id^="guide-"]').forEach(g => { const c = g.cloneNode(true); c.removeAttribute("id"); c.removeAttribute("class"); c.setAttribute("style", "fill:none;stroke:#ff3d00;stroke-width:" + (.13 / Math.abs(g.getCTM().a / ink.getCTM().a || 1)) + ";stroke-dasharray:none;opacity:1"); c.setAttribute("stroke-dasharray", "none"); ink.appendChild(c); });   // the template's own guide paths, on top
      if (S.mode === "ud") { const key = scale.toFixed(4) + "|" + S.one + "|" + S.zoom + "|" + S.steps + S.asPrinted, t0 = performance.now(), k = gk && gk.key === key ? gk : (gk = onGuide()); if (!k.key) { k.key = key; k.ms = Math.round(performance.now() - t0); } root.__ud.guideCheck = k; legend = (k.ok ? "" : "<b>off the guides&nbsp;</b>") + legend + "<span>ring junctions on the rings &middot; untouched lines " + k.asPrintedMaxPx.toFixed(3) + " px off the guides, snapped ones up to " + k.maxPx.toFixed(2) + " px (" + k.maxPt.toFixed(2) + " pt) &middot; arch " + R.ud.model.rise_per_chord.toFixed(3) + " of chord</span>"; }
      leg.innerHTML = legend;
      $("bTheme").textContent = S.theme; const bp = $("bPaper"); bp.textContent = S.paper; bp.hidden = S.theme !== "light"; $("bText").textContent = S.mode; $("bSnap").textContent = S.asPrinted ? "as printed" : S.steps ? "snapped to rings" : "steps as printed"; $("bGuides").textContent = "dots"; $("bGuides").className = S.dots ? "on" : ""; $("bSet").hidden = S.mode !== "ud"; $("bSet").textContent = S.mode === "ud" ? root.__ud.rule.replace("-", " ") : ""; $("bZoom").className = S.zoom > 1 ? "on" : "";
      root.__notemap = { template: edges, mode: "routes-" + S.mode, scale: +scale.toFixed(2), routes: R.counts, uniform: R.uniform, check: R.check, lengths: [3, 7, 12].map(lenFor) };
    }
    ["bComp", "bPlay"].forEach(id => { $(id).hidden = true; });
    const on = (id, f) => $(id).addEventListener("click", () => { f(); pushUrl(); render(); });
    on("bSet", () => { S.ud = (R.ud.table[S.ud] ? S.ud : R.ud.rule) === "by-side" ? "by-half" : "by-side"; });
    on("bTheme", () => { S.theme = S.theme === "dark" ? "light" : "dark"; });
    on("bPaper", () => { S.paper = PAPERS[(PAPERS.indexOf(S.paper) + 1) % PAPERS.length]; });
    $("bText").addEventListener("click", () => { const i = MODES.indexOf(S.mode) + 1; if (i >= MODES.length) { location.search = "?" + (edges === "simple" ? "template=simple&" : "") + "theme=" + S.theme + (S.asPrinted ? "&snap=printed" : S.steps ? "&snap=rings" : "") + (S.paper !== "white" ? "&paper=" + S.paper : ""); return; } S.mode = MODES[i]; pushUrl(); render(); });   // after the last lines-only mode, back to the notes
    on("bGuides", () => { S.dots = !S.dots; });
    on("bSnap", () => { if (S.asPrinted) { S.asPrinted = false; S.steps = true; } else if (S.steps) S.steps = false; else S.asPrinted = true; gk = null; });
    on("bZoom", () => { if (S.zoom > 1) S.zoom = 1; else { S.zoom = 2.4; S.fx = .5; S.fy = .5; } });
    sheet.addEventListener("dblclick", e => { const r = sheet.getBoundingClientRect(); if (S.zoom > 1) S.zoom = 1; else { S.zoom = 2.4; S.fx = (e.clientX - r.left) / r.width; S.fy = (e.clientY - r.top) / r.height; } pushUrl(); render(); });
    let rz = 0; root.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(render, 120); });
    const base = new URL("../template/", location.href).href;
    Promise.all([root.SmartWisdomTemplate.load(), fetch(base + "routes.json").then(r => r.json())]).then(([T, routes]) => { R = routes;
      R.routes.forEach(r => { r.cum = [0]; for (let i = 1; i < r.pts.length; i++) r.cum.push(r.cum[i - 1] + Math.hypot(r.pts[i][0] - r.pts[i - 1][0], r.pts[i][1] - r.pts[i - 1][1])); });
      T.mount(tpl, { edges }); pushUrl(); render();
    }).catch(e => { leg.innerHTML = "<b>routes need the page served over http (" + (e && e.message || e) + ")</b>"; });
  }
  root.RoutesView = { run };
})(window);
