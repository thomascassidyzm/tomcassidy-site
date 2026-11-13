// THE SHARED CONTENT for the drawing-surface design trial (job #554·AH). Every design renders these SAME two sets.
// Do not edit per design. Raw form: [label, level?, [children]?]. level = competence 0..4 (0 not started,
// 1 met, 2 shaky, 3 secure, 4 mastered); null = no competence data (the one-minute note has none).
// window.NOTEMAP_CONTENT.sets.<name> = { title, date, centre, tree, nodes }
//   tree:  nested { id, t, lvl, depth, order, parent, c:[...] }   (depth 1 = main branch off the star)
//   nodes: the same objects flat, in ARRIVAL ORDER (order 0,1,2…) = the order a voice would have placed them.
(function () {
  const note25 = ["SLEEP", [
    ["Why it matters", null, [["memory consolidates overnight"], ["clears brain waste"], ["steadier mood next day"], ["immune system repairs"]]],
    ["Stages", null, [["light sleep first"], ["deep slow-wave sleep"], ["REM dreaming", null, [["emotional memories processed"]]], ["ninety-minute cycles"]]],
    ["What wrecks it", null, [["caffeine after noon"], ["screens late at night"], ["irregular bedtimes"], ["alcohol fragments sleep"]]],
    ["What helps", null, [["same wake time daily"], ["morning daylight"], ["cool dark room"], ["wind-down routine"]]],
    ["Teenagers", null, [["body clock runs later"], ["early school starts hurt"], ["need nine hours"]]],
  ]];
  const physics120 = ["GCSE PHYSICS", [
    ["Energy", 3, [
      ["energy stores", 4, [["kinetic ½mv²", 4], ["gravitational mgh", 3], ["elastic ½ke²", 2]]],
      ["transfers", 3, [["work = force × distance", 3], ["power = energy ÷ time", 4]]],
      ["conservation", 3, [["never created or destroyed", 4], ["dissipated as heat", 3]]],
      ["efficiency", 2, [["useful out ÷ total in", 2], ["reduce with lubrication", 1]]],
      ["resources", 1, [["renewable vs finite", 2], ["reliability of supply", 0]]],
    ]],
    ["Electricity", 2, [
      ["circuits", 3, [["current is charge flow", 3], ["potential difference", 2], ["resistance V = IR", 3]]],
      ["series and parallel", 2, [["current same in series", 3], ["p.d. shared in series", 1]]],
      ["components", 2, [["filament lamp curve", 2], ["diode one way", 2], ["thermistor and LDR", 1]]],
      ["mains", 1, [["230 volts 50 hertz", 2], ["live neutral earth", 1]]],
      ["power", 2, [["P = IV", 3], ["national grid transformers", 1]]],
    ]],
    ["Particle model", 3, [
      ["density", 4, [["mass ÷ volume", 4], ["measuring irregular solids", 3]]],
      ["states of matter", 4, [["solid liquid gas", 4], ["changes of state", 3]]],
      ["internal energy", 2, [["specific heat capacity", 2], ["specific latent heat", 1], ["heating curves", 2]]],
      ["gas pressure", 2, [["particles hit the walls", 3], ["hotter means faster", 3], ["pV is constant", 1]]],
    ]],
    ["Atomic structure", 1, [
      ["the atom", 3, [["protons neutrons electrons", 4], ["isotopes", 2], ["plum pudding to nuclear", 2]]],
      ["radiation", 1, [["alpha beta gamma", 2], ["ionising power", 1], ["penetration", 1]]],
      ["half-life", 1, [["random decay", 2], ["reading decay curves", 0]]],
      ["hazards", 1, [["contamination vs irradiation", 0], ["background radiation", 1]]],
      ["fission and fusion", 0, [["chain reactions", 0], ["fusion in stars", 0]]],
    ]],
    ["Forces", 3, [
      ["scalars and vectors", 4, [["resultant force", 3], ["free body diagrams", 3]]],
      ["motion", 3, [["speed and velocity", 4], ["acceleration", 3], ["distance-time graphs", 4], ["velocity-time graphs", 2]]],
      ["Newton's laws", 3, [["inertia", 3], ["F = ma", 4], ["equal and opposite", 2]]],
      ["momentum", 1, [["p = mv", 2], ["conserved in collisions", 1]]],
      ["stopping distance", 2, [["thinking distance", 3], ["braking distance", 2]]],
    ]],
    ["Waves", 2, [
      ["wave properties", 3, [["transverse and longitudinal", 3], ["v = fλ", 3], ["amplitude and period", 2]]],
      ["reflection and refraction", 2, [["ray diagrams", 2], ["speed changes at boundary", 1]]],
      ["electromagnetic spectrum", 2, [["radio to gamma", 3], ["uses of each band", 2], ["dangers of high frequency", 2]]],
      ["sound", 1, [["needs a medium", 2], ["ultrasound echoes", 0]]],
    ]],
    ["Magnetism", 1, [
      ["magnets", 3, [["poles attract and repel", 4], ["field line patterns", 2]]],
      ["electromagnets", 1, [["field round a wire", 2], ["solenoids", 1]]],
      ["motor effect", 0, [["Fleming's left hand", 1], ["F = BIL", 0], ["electric motors", 0]]],
      ["induction", 0, [["generator effect", 0], ["transformers", 0], ["alternators and dynamos", 0]]],
    ]],
    ["Space", 0, [
      ["solar system", 2, [["planets and moons", 3], ["orbits need gravity", 1]]],
      ["life of a star", 0, [["nebula to main sequence", 1], ["red giant", 0], ["supernova and black hole", 0]]],
      ["the universe", 0, [["red-shift", 0], ["big bang evidence", 0]]],
      ["satellites", 1, [["natural and artificial", 1], ["orbital speed changes", 0]]],
    ]],
  ]];
  // A transcription of the hand-written worked example on guide p.69 ("How to read"), for the likeness test.
  // Each node is ONE arch of the original (a word or two), chained outwards exactly as the hand chained them.
  // Transcribed by eye from the picture; if a word here disagrees with the picture, the picture wins: report it.
  const darwin = ["DARWIN", [
    ["RESULT", null, [
      ["OBSERVATIONS", null, [["ROUND", null, [["WORLD", null, [["EXPEDITION"]]]]]]],
      ["BACKED", null, [["EXPERIMENT"], ["DISCUSSION"]]],
    ]],
    ["PROPOSED", null, [
      ["THEORY", null, [
        ["LINKING", null, [["DEVELOPING", null, [["KNOWLEDGE", null, [["GEOLOGY"], ["FOSSILS"]]]]]]],
        ["EVOLUTION", null, [["BY", null, [["NATURAL"], ["SELECTION"]]]]],
      ]],
    ]],
    ["DEFINITION", null, [
      ["CHANGE", null, [["FREQUENCY", null, [["PHENOTYPE", null, [["POPULATION"], ["GENERATIONS"]]]]]]],
    ]],
    ["SIMPLE", null, [
      ["INDIVIDUAL", null, [
        ["SPECIES", null, [["WIDE", null, [["VARIATION"]]], ["CAUSED", null, [["DIFFERENT", null, [["GENES"]]]]]]],
        ["CHARACTERISTICS", null, [["SUITED", null, [["ENVIRONMENT", null, [["> CHANCE", null, [["SURVIVAL"], ["REPRODUCTION"]]]]]]]]],
        ["PASSED", null, [["OFFSPRING", null, [["HIGHER", null, [["RATE"]]]]], ["COMPARED", null, [["< SUITED"]]]]],
      ]],
    ]],
    ["GENERATIONS", null, [
      ["CHARACTERISTICS", null, [["COMMON"]]],
      ["SPECIES", null, [["CHANGES"]]],
    ]],
    ["RESULT", null, [["KNOWN", null, [["SURVIVAL", null, [["FITTEST"]]]]]]],
    ["BOOK", null, [["1859", null, [["'ORIGIN OF SPECIES'"]]]]],
  ]];
  // A transcription of Tom's own sheet "Jonathan Kemp intro SmartWisdom" (uploads/tom/f8743671-…00.39.33.jpg): the
  // clearest view of the hand and THE standard of likeness. One node per arch, chained as drawn, clockwise from
  // 1 o'clock. Transcribed by eye; where this disagrees with the picture, the picture wins: report it.
  const C = (...w) => w.reduceRight((k, t) => [t, null, k ? [k] : []], null);   // a plain chain of arches
  const kemp = ["SMARTWISDOM", [
    ["SMART", null, [
      ["WISDOM", null, [
        ["NOTE-TAKING", null, [["STEROIDS"], C("LOOK", "COOL")]],
        ["TOOL", null, [C("RECORD", "KNOWLEDGE"), C("ANALYSE", "INFORMATION")]],
      ]],
      ["SKILL", null, [C("IMPROVE", "THINKING"), C("NEW", "INSIGHTS")]],
    ]],
    ["STUDY", null, [C("SCHOOL", "STRETCHED", "TO BRAIN"), C("UNIVERSITY", "INFORMATION", "OVERLOAD")]],
    ["SEARCHED", null, [["BETTER", null, [["WAY", null, [C("TAKE", "NOTES"), C("BRAIN", "MAKE", "SENSE")]]]]]],
    ["WHY", null, [
      ["NOTES", null, [
        ["(WORK)", null, [["(CHANGED)", null, [["2000 YRS", null, [["LISTS"], ["BULLETS"]]]]]]],
        ["(HOW)", null, [["BRAIN", null, [["WORKS", null, [["STORES"], ["PROCESSES"]]]]]]],
      ]],
      ["COMPUTERS", null, [["WORSE"], ["TYPING", null, [["RECORDING", null, [["(THINKING)"], ["(UNDERSTANDING)"]]]]]]],
    ]],
    ["EASY", null, [C("LEARN", "2X", "HOURS", "PRACTICE"), C("ANYONE", "LEARN", "USE", "QUICKLY")]],
    ["TEMPLATE", null, [
      C("THREE", "CIRCLES", "IDEAS", "EXPAND", "OUTWARDS"),
      ["CONNECTORS", null, [["LINK", null, [["INFO"], ["DETAILS"]]]]],
      C("CAPITAL", "LETTERS", "EASY TO", "READ"),
    ]],
    ["USEFUL", null, [
      ["MEETINGS", null, [["LECTURES", null, [C("CLASSES", "ONLINE")]]]],
      ["PLANNING", null, [C("STORIES", "ESSAYS"), ["PRESENTATIONS"]]],
      C("TAKING", "NOTES", "REVISING", "EXAMS"),
    ]],
    ["BENEFITS", null, [["IMPROVES", null, [C("RECALL", "FASTER", "DETAILS")]]]],
    ["PROMPTS", null, [C("DEEPER", "QUESTIONS"), C("DRAW", "UNFORESEEN", "CONCLUSIONS")]],
    ["CHANGED", null, [["LIFE", null, [["SUCCESSFUL", null, [["BUSINESS"], C("DEGREE", "DISTINCTION")]]]]]],
    ["START", null, [C("USING", "SMARTWISDOM", "TODAY"), C("MAKE", "YOUR", "LIFE", "SUCCESS")]],
  ]];
  function build(raw, title, date, interleave) {
    let n = 0; const nodes = [];
    const mk = (r, depth, parent) => {
      const o = { id: "n" + (++n), t: r[0], lvl: r[1] == null ? null : r[1], depth, parent: parent ? parent.id : null, c: [] };
      nodes.push(o);
      (Array.isArray(r[2]) ? r[2] : Array.isArray(r[1]) ? r[1] : []).forEach(k => o.c.push(mk(k, depth + 1, o)));
      return o;
    };
    const tree = raw[1].map(b => mk(b, 1, null));
    nodes.forEach((o, i) => (o.order = i));            // spoken order: each branch, then its twigs, depth-first
    return { title, date, centre: raw[0], tree, nodes };
  }
  window.NOTEMAP_CONTENT = { build, sets: {   // build is exposed so content-zh.js can add the Chinese sets the same way
    note25: build(note25, "Sleep: a one-minute note", "12 Nov 2026"),
    physics120: build(physics120, "GCSE Physics: subject map", "12 Nov 2026"),
    darwin: build(darwin, "Theory of evolution", ""),
    kemp: build(kemp, "Jonathan Kemp intro SmartWisdom", "Today"),
  } };
})();
