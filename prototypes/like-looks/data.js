// Fixed sample data for the three look samples. Words verbatim from
// src/lib/like/skin.ts (COPY, AXES, leanLine, gapLine, paintFieldLine) and one
// moment from src/lib/like/bank.json, as on origin/dev 2026-11-15.
// One fixed, plausible sample profile — not wired to the engine.
window.LIKE = (function () {
  const AXES = {
    O: { label: 'Openness', lo: 'the familiar', hi: 'the unfamiliar' },
    C: { label: 'Conscientiousness', lo: 'going with the flow', hi: 'following through' },
    E: { label: 'Extraversion', lo: 'recharging alone', hi: 'recharging with people' },
    A: { label: 'Agreeableness', lo: 'saying the plain thing', hi: 'keeping the peace' },
    N: { label: 'Sensitivity', lo: 'a quiet alarm', hi: 'a loud alarm' },
    R: { label: 'Risk appetite', lo: 'protecting the downside', hi: 'chasing the uncertain' },
  };
  const KEYS = ['O', 'C', 'E', 'A', 'N', 'R'];
  const end = (k, s) => (s > 0 ? AXES[k].hi : AXES[k].lo);
  const COPY = {
    title: 'What are you like, anyway?',
    statedLabel: 'Before the moments',
    statedTitle: 'Where do you think you’ll land?',
    statedHint: 'One tap per line. Your gut, not your best self.',
    statedGo: 'On to the moments',
    statedSkip: 'Skip — I’d rather not guess',
    pickLabel: 'Most likely to least likely',
    rankHint: 'Tap them in the order you’d do them. Hold and drag to change it; tap a numbered one to take it out.',
    rankTop: 'Most likely',
    rankBottom: 'Least likely',
    rankDone: 'Next',
    rankTie: 'The others are all the same',
    back: 'Back',
    resultLabel: 'Your portrait, so far',
    sharpen: 'Sharpen it — 10 more moments',
    momentsSoFar: (n) => `From ${n} moments. More moments, sharper picture.`,
    leanHeading: 'Which way your picks lean',
    gapHeading: 'Between what you said and what you picked',
    matchedLine: (l) => `Where your picks matched your guess: ${l.join(', ')}.`,
    paintKey: 'How to read your painting',
    paintWhite: (l) => `The white fields: nearer the middle — ${l.join(', ')}.`,
    paintLines: (n) => `The black lines: drawn from ${n} moments. More moments, finer lines.`,
    paintCredit: 'after Piet Mondrian',
    startOver: 'Start again',
  };
  function leanLine(k, side, strong, painted = true) {
    if (side === 0) return `Your picks sat around the middle, between ${AXES[k].lo} and ${AXES[k].hi}.`;
    if (!painted) return `Near the middle, slightly towards ${end(k, side)}.`;
    return `You lean ${strong ? 'clearly ' : ''}towards ${end(k, side)}.`;
  }
  function gapLine(k, statedSide, revealedSide, delta) {
    const towards = end(k, delta > 0 ? 1 : -1);
    if (statedSide === 0) return `You said you’d sit in the middle. Your picks leaned towards ${towards}.`;
    const said = end(k, statedSide);
    if (revealedSide === 0) return `You said you’d lean towards ${said}. Your picks sat nearer the middle.`;
    if (revealedSide !== statedSide) return `You said you’d lean towards ${said}. Your picks leaned towards ${end(k, revealedSide)}.`;
    return Math.sign(delta) === statedSide
      ? `You said you’d lean towards ${said}. Your picks leaned further that way than you guessed.`
      : `You said you’d lean towards ${said}. Your picks leaned that way, but less than you guessed.`;
  }
  function paintFieldLine(hue, area, k, side) {
    const size = area > 0.3 ? 'wide ' : area < 0.12 ? 'small ' : '';
    return `The ${size}${hue} field: a lean towards ${end(k, side)}`;
  }
  // The moment (bank.json, e-party-host-kitchen), verbatim.
  const MOMENT = {
    s: 'You arrive at a party where the only person you know is the host — and they’re busy in the kitchen.',
    opts: [
      'Pick up a tea towel and help — it gives you a job, and people drift to the kitchen anyway',
      'Walk up to the nearest group and introduce yourself cold',
      'Find one other person standing alone and talk to them',
      'Post up somewhere quiet with your phone and plan an early exit',
    ],
  };
  // Sample profile: lean in -1..1 (hi end positive), stated on the 1..5 scale.
  const PROFILE = {
    O: { lean: 0.55, stated: 4, strong: true },
    C: { lean: -0.18, stated: 4, strong: false },
    E: { lean: -0.62, stated: 2, strong: true },
    A: { lean: 0.22, stated: 3, strong: false },
    N: { lean: 0.04, stated: 2, strong: false },
    R: { lean: -0.38, stated: 3, strong: false },
  };
  const PAINTED = ['E', 'O', 'R']; // clearest three leans -> red, blue, yellow
  const HUE = { E: 'red', O: 'blue', R: 'yellow' };
  const N_MOMENTS = 10;
  const side = (v) => (Math.abs(v) < 0.1 ? 0 : v > 0 ? 1 : -1);
  const statedSide = (s) => (s === 3 ? 0 : s > 3 ? 1 : -1);
  const leans = KEYS.map((k) => ({
    k, label: AXES[k].label, lo: AXES[k].lo, hi: AXES[k].hi, lean: PROFILE[k].lean,
    painted: PAINTED.includes(k), hue: HUE[k] || 'white',
    line: leanLine(k, side(PROFILE[k].lean), PROFILE[k].strong, PAINTED.includes(k)),
    stated: PROFILE[k].stated,
  }));
  const gaps = [], matched = [];
  KEYS.forEach((k) => {
    const ss = statedSide(PROFILE[k].stated), rs = side(PROFILE[k].lean);
    const delta = PROFILE[k].lean - (PROFILE[k].stated - 3) / 2;
    if (ss === rs && Math.abs(delta) < 0.3) matched.push(AXES[k].label);
    else gaps.push({ k, label: AXES[k].label, line: gapLine(k, ss, rs, delta) });
  });
  // A fixed after-Mondrian composition (canvas 100x100) for the profile.
  const FIELDS = [
    { k: 'E', x: 52, y: 0, w: 48, h: 58, hue: 'red' },
    { k: 'O', x: 0, y: 0, w: 52, h: 38, hue: 'blue' },
    { k: 'R', x: 52, y: 58, w: 48, h: 42, hue: 'yellow' },
    { k: 'A', x: 0, y: 38, w: 30, h: 62, hue: 'white' },
    { k: 'C', x: 30, y: 38, w: 22, h: 34, hue: 'white' },
    { k: 'N', x: 30, y: 72, w: 22, h: 28, hue: 'white' },
  ];
  const keyLines = FIELDS.filter((f) => f.hue !== 'white').map((f) => ({
    k: f.k, hue: f.hue, line: paintFieldLine(f.hue, (f.w * f.h) / 10000, f.k, side(PROFILE[f.k].lean)),
  }));
  const whites = FIELDS.filter((f) => f.hue === 'white').map((f) => AXES[f.k].label);
  return { AXES, KEYS, COPY, MOMENT, leans, gaps, matched, FIELDS, keyLines, whites, N_MOMENTS };
})();
