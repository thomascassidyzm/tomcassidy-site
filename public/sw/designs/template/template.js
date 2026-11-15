// THE ONE SMARTWISDOM TEMPLATE RENDERER, shared by notemap (the voice map), the drawing-surface designers (#554·AH) and
// the physics one-page map (#559·AH). Tom 2026-11-13 00:01Z: "the template is exact to the pixel - unless you think
// anything is in error". So nobody draws the template; everybody MOUNTS it from here.
//
// What it renders: ./template.svg — the PDF's own vector (pdftocairo -svg of uploads/tom/3f19d241-SmartWisdom.pdf),
// with the two question-line spellings Tom ruled (23:53Z): "What", "Discover" (Q3 re-spaced), and TIDIED on his ruling of
// 00:22Z 13 Nov (star upright to ring 1 with its guides, even bands, one dash pattern, no overlaps, stub gone, marker inside
// the frame) by tools/template-tidy.py from template-pdf.svg. Every change: docs/TEMPLATE-EXACTNESS.md.
// Proof of exactness and the list of things in the vector that may be unintended: docs/TEMPLATE-EXACTNESS.md.
//
// Use (plain script or ES-module-free; works from any page under public/):
//   <script src="/designs/template/template.js"></script>      (or a relative path)
//   const T = await SmartWisdomTemplate.load();                 // fetches template.svg + template.json once
//   T.mount(svgGroup)                                          // template in PAGE units (pt, 612 × 432.87, y down)
//   T.mount(svgGroup, { origin: "centre", scale: s })          // centred on the disc, scaled: world = (page - centre) * s
//   T.mount(svgGroup, { edges: "simple" })                     // the simple template: same centre, edge codes left off
//   T.geometry  → { page, centre, radii, frame, boxes, markers, guides }   (page units; all measured from the vector)
// Never restyle, crop or re-proportion the mounted group. Ink goes in your own layer ABOVE it.
(function (root) {
  "use strict";
  const HERE = (() => { try { return new URL(".", document.currentScript.src).href; } catch { return "designs/template/"; } })();
  // Measured from the vector (notemap pass 3, 2026-11-13): page units, y down. template.json carries centre, radii, guides.
  const EXTRA = {
    frame: { x0: 37.1, y0: 45.6, x1: 580.9, y1: 420.5 },                       // the drawing frame (path 57)
    boxes: { date: [175.575, 218.9], subject: [218.9, 313.6], topic: [313.6, 408.3], page: [408.3, 420.5], x: [20.6, 37.1] },
    markers: [ { x0: 533.8, y0: 47.8, x1: 575.8, y1: 61.1 }, { x0: 42.4, y0: 405.4, x1: 81.3, y1: 418.3 } ],   // U/D
    bands: [45.6, 88.925, 132.25, 175.575, 218.9],                             // VALUE-ANALYSIS-MEMORY band lines (even)
    starterAngleDeg: -45,                                                       // where the 1:30 starter connector leaves ring 1 (star upright after the tidy)
    switchbacksDeg: { top: [-135, -85], bottom: [45, 95] },                      // corridors, after the tidy's 4° turn
  };
  let cache = null;
  async function load(base = HERE, file = "template.svg") {   // file "template-pdf.svg" = the untidied PDF stage, for proofs only
    if (cache && cache.file === file) return cache;
    const [svgText, json] = await Promise.all([fetch(base + file).then((r) => r.text()), fetch(base + "template.json").then((r) => r.json())]);
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const nodes = [...doc.documentElement.childNodes];
    const geometry = { ...json, ...EXTRA };
    function mount(group, opts = {}) {
      const NS = "http://www.w3.org/2000/svg";
      const g = group.ownerDocument.createElementNS(NS, "g");
      g.setAttribute("class", "smartwisdom-template"); g.setAttribute("pointer-events", "none");
      if (opts.origin === "centre") {
        const s = opts.scale || 1, [cx, cy] = json.centre;
        g.setAttribute("transform", `matrix(${s} 0 0 ${s} ${-cx * s} ${-cy * s})`);
      }
      // opts.edges "simple": the same vector with the business EDGE CODES left off (Codes column, question line, VALUE-ANALYSIS-MEMORY
      // letters, bands and stepped markers; list in template.json "edge_codes", made by tools/template-edges.py). The centre is shared.
      const off = opts.edges === "simple" ? new Set(json.edge_codes || []) : null; let i = -1;
      for (const n of nodes) { if (n.nodeType === 1 && n.localName !== "defs") { i++; if (off && off.has(i)) continue; } g.appendChild(group.ownerDocument.importNode(n, true)); }
      group.appendChild(g);
      return g;
    }
    cache = { geometry, mount, svgText, file };
    return cache;
  }
  // THE SMARTBOOK PAGE (template=smartbook). First taken for "the simpler template"; Tom then ruled (02:49Z) that the simple
  // template has the business template's own centre with the edge codes off, which is mount(..., { edges: "simple" }) above.
  // This one stays as a third sheet: Jonathan's dark e-planner page. Source: Jonathan Kemp's SmartBook 250DG, page 7, exactly as that PDF page draws it; its map (rings,
  // star, dashed guides) is the page's own 2732x2048 image, pixel for pixel. Only the planner's teal example trace is left out
  // (tools/simple-template-build.sh). It is a raster, so nothing here is tidied. Page units: pt, 2381 x 1684, y down.
  //   const T = await SmartWisdomTemplate.loadSimple();  T.mount(svgGroup);  T.geometry (simple.json)  T.network (simple-network.json)
  let simple = null;
  async function loadSimple(base = HERE + "simple/") {
    if (simple) return simple;
    const [svgText, geometry, network] = await Promise.all([fetch(base + "simple.svg").then((r) => r.text()), fetch(base + "simple.json").then((r) => r.json()), fetch(base + "simple-network.json").then((r) => r.json())]);
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const nodes = [...doc.documentElement.childNodes];
    function mount(group) {
      const g = group.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "smartwisdom-template simple"); g.setAttribute("pointer-events", "none");
      for (const n of nodes) g.appendChild(group.ownerDocument.importNode(n, true));
      group.appendChild(g);
      return g;
    }
    simple = { geometry, network, mount, svgText, file: "simple/simple.svg" };
    return simple;
  }
  const api = { load, loadSimple, EXTRA };
  if (typeof module === "object" && module.exports) module.exports = api; else root.SmartWisdomTemplate = api;
})(typeof window !== "undefined" ? window : globalThis);
