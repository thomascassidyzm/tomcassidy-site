/**
 * "What are you like, anyway?" — the player. DOM only: state comes from the
 * engine, words from the skin. Everything a person does is written straight
 * back into the URL fragment, so the address bar is always the save.
 */
import {
  AXIS_KEYS,
  BLOCK,
  MAX_MOMENTS,
  MOMENTS,
  STATED_POS,
  answeredCount,
  compareAxis,
  decodeState,
  encodeState,
  gaps,
  guessMoments,
  readAll,
  returnState,
  sideOf,
  type AxisKey,
  type Person,
  type Side,
  type State,
} from './engine';
import { AXES, COPY, TRY, gapLine, inline, leanLine, tryLabel } from './skin';

let st: State = {};
/* The outgoing card stays tappable through its exit fade; this closes it so a
   double-tap can't answer two moments with one card on screen. */
let busy = false;
/** Transient UI: nothing here needs to survive a reload. */
const ui: {
  started: boolean;
  qi: number | null;
  least: number | null;
  stated: (number | null)[];
  tryPick: string | null;
  tryAll: boolean;
  showHow: boolean;
  shareUrl: string | null;
  backUrl: string | null;
  animated: boolean;
} = {
  started: false,
  qi: null,
  least: null,
  stated: [null, null, null, null, null, null],
  tryPick: null,
  tryAll: false,
  showHow: false,
  shareUrl: null,
  backUrl: null,
  animated: false,
};

const root = () => document.getElementById('like-app')!;
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const nameOf = (p?: Person) => (p?.name ? p.name : 'Your friend');
const target = () => st.t ?? BLOCK;

function save() {
  const h = encodeState(st);
  history.replaceState(null, '', h ? '#' + h : location.pathname);
}

function linkFor(s: State) {
  return location.origin + location.pathname + '#' + encodeState(s);
}

/* ================= STAGE ================= */
type Stage = 'front' | 'guessFront' | 'guess' | 'guessReveal' | 'stated' | 'moment' | 'result';

function stage(): Stage {
  if (st.ask && st.them && !st.me) {
    const gm = guessMoments(st.them);
    const done = gm.filter((i) => st.gt?.[i] !== undefined).length;
    if (done === 0 && !ui.started) return 'guessFront';
    if (done < gm.length) return 'guess';
    return 'guessReveal';
  }
  if (!st.me) return 'front';
  if (st.me.stated === undefined) return 'stated';
  if (firstUnanswered() >= 0 || ui.least !== null) return 'moment';
  return 'result';
}

function firstUnanswered(): number {
  const a = st.me!.answers;
  for (let i = 0; i < Math.min(target(), MAX_MOMENTS); i++) if (!a[i]) return i;
  return -1;
}

/* ================= RENDER ================= */
function render() {
  const s = stage();
  const el = root();
  el.dataset.stage = s;
  el.innerHTML =
    s === 'front' ? front()
    : s === 'guessFront' ? guessFront()
    : s === 'guess' ? guessCard()
    : s === 'guessReveal' ? guessReveal()
    : s === 'stated' ? stated()
    : s === 'moment' ? momentCard()
    : result();
  if (s === 'result') sharpen();
  window.scrollTo(0, 0);
}

function front() {
  return `<section class="screen front enter">
    <h1 class="title">${COPY.title}</h1>
    <p class="dek">${COPY.dek}</p>
    <button class="pill primary" data-act="start">${COPY.start}</button>
    <p class="fine">${COPY.privacy}</p>
    <button class="textlink" data-act="how" aria-expanded="${ui.showHow}">${COPY.how}</button>
    ${ui.showHow ? `<div class="how">${COPY.howBody.map((p) => `<p>${p}</p>`).join('')}</div>` : ''}
  </section>`;
}

function guessFront() {
  const n = esc(nameOf(st.them));
  return `<section class="screen front enter">
    <p class="label">${COPY.guessHeading}</p>
    <h1 class="title">${COPY.guessFrontTitle(n)}</h1>
    <p class="dek">${COPY.guessFrontDek(n)}</p>
    <button class="pill primary" data-act="guessStart">${COPY.guessStart(n)}</button>
    <p class="fine">${COPY.privacy}</p>
  </section>`;
}

function progress(done: number, total: number, notches = 0) {
  const pct = Math.round((done / total) * 100);
  let n = '';
  for (let i = 1; i < notches; i++) n += `<i style="left:${(i / notches) * 100}%"></i>`;
  return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}" aria-label="${done} of ${total}"><b style="width:${pct}%"></b>${n}</div>`;
}

function stated() {
  const rows = AXIS_KEYS.map((k, i) => {
    const sel = ui.stated[i];
    const dots = STATED_POS.map(
      (_, j) =>
        `<button class="tapdot${sel === j ? ' on' : ''}" data-act="stated" data-axis="${i}" data-v="${j}" aria-pressed="${sel === j}" aria-label="${esc(AXES[k].label)}: ${j + 1} of 5, from ${esc(AXES[k].lo)} to ${esc(AXES[k].hi)}"><span></span></button>`,
    ).join('');
    return `<div class="srow" style="--i:${i}">
      <div class="srow-head"><span class="axis">${AXES[k].label}</span></div>
      <div class="dots">${dots}</div>
      <div class="ends"><span>${AXES[k].lo}</span><span>${AXES[k].hi}</span></div>
    </div>`;
  }).join('');
  const all = ui.stated.every((v) => v !== null);
  return `<section class="screen enter">
    <p class="label">${COPY.statedLabel}</p>
    <h2 class="h2">${COPY.statedTitle}</h2>
    <p class="hint">${COPY.statedHint}</p>
    <div class="stated">${rows}</div>
    <button class="pill primary" data-act="statedGo" ${all ? '' : 'disabled'}>${COPY.statedGo}</button>
    <button class="pill quiet" data-act="statedSkip">${COPY.statedSkip}</button>
  </section>`;
}

function optionButtons(qi: number, mode: 'pick' | 'least' | 'guess', picked?: number) {
  const m = MOMENTS[qi];
  return m.opts
    .map((o, i) => {
      const isPick = picked === i;
      const act = mode === 'guess' ? 'guess' : mode === 'least' ? (isPick ? '' : 'least') : 'pick';
      return `<button class="opt${isPick ? ' picked' : ''}" style="--i:${i}" ${act ? `data-act="${act}"` : 'disabled aria-disabled="true"'} data-v="${i}">${esc(o.t)}</button>`;
    })
    .join('');
}

function momentCard() {
  const me = st.me!;
  const qi = ui.qi ?? firstUnanswered();
  ui.qi = qi;
  const m = MOMENTS[qi];
  const a = me.answers[qi];
  const inLeast = ui.least === qi && a && a !== 'x';
  const picked = a && a !== 'x' ? a.p : undefined;
  const blockStart = Math.floor(qi / BLOCK) * BLOCK;
  const done = answeredCount(me.answers.slice(blockStart, blockStart + BLOCK));
  const canBack = qi > blockStart;
  return `<section class="screen moment">
    <div class="topbar">
      <button class="back" data-act="back" ${canBack ? '' : 'disabled'} aria-label="${COPY.back}">←</button>
      ${progress(done, BLOCK)}
    </div>
    <article class="card enter" aria-live="polite">
      <p class="label">${inLeast ? COPY.leastLabel : COPY.pickLabel}</p>
      <p class="scenario">${esc(m.s)}</p>
      <div class="opts">${optionButtons(qi, inLeast ? 'least' : 'pick', picked)}</div>
      ${
        inLeast
          ? `<button class="pill quiet skip" data-act="leastSkip">${COPY.leastSkip} →</button>`
          : `<button class="exit${a === 'x' ? ' picked' : ''}" data-act="exit">${esc(m.x ?? COPY.exitDefault)}</button>`
      }
    </article>
  </section>`;
}

function guessCard() {
  const them = st.them!;
  const gm = guessMoments(them);
  const k = gm.findIndex((i) => st.gt?.[i] === undefined);
  const qi = gm[k];
  const m = MOMENTS[qi];
  return `<section class="screen moment">
    <div class="topbar"><span class="back-spacer"></span>${progress(k, gm.length)}</div>
    <article class="card enter" aria-live="polite">
      <p class="label">${esc(COPY.guessPick(nameOf(them)))}</p>
      <p class="scenario">${esc(m.s)}</p>
      <div class="opts">${optionButtons(qi, 'guess')}</div>
    </article>
  </section>`;
}

function pickText(qi: number, p: number) {
  return esc(inline(MOMENTS[qi].opts[p].t));
}

function guessReveal() {
  const them = st.them!;
  const n = nameOf(them);
  const gm = guessMoments(them);
  let hit = 0;
  const items = gm
    .map((qi, j) => {
      const a = them.answers[qi] as { p: number };
      const g = st.gt![qi];
      const right = g === a.p;
      if (right) hit++;
      return `<li class="gitem" style="--i:${j}">
        <p class="gscene">${esc(MOMENTS[qi].s)}</p>
        ${
          right
            ? `<p class="gline right"><span class="tag">${COPY.guessRight}</span> ${pickText(qi, a.p)}</p>`
            : `<p class="gline"><span class="tag">${COPY.guessSurprise}</span> ${esc(COPY.youThought(n))}: ${pickText(qi, g)}.</p>
               <p class="gline">${esc(COPY.theyPicked(n))}: ${pickText(qi, a.p)}.</p>`
        }
      </li>`;
    })
    .join('');
  return `<section class="screen enter">
    <p class="label">${COPY.guessHeading}</p>
    <h2 class="h2">${esc(COPY.guessRevealTitle(n, hit, gm.length))}</h2>
    <ul class="glist">${items}</ul>
    <button class="pill primary" data-act="nowYours">${COPY.nowYours}</button>
  </section>`;
}

/* ---------- the result ---------- */
function portrait(me: Person, them?: Person) {
  const r = readAll(me.answers);
  const rt = them ? readAll(them.answers) : null;
  const rows = AXIS_KEYS.map((k, i) => {
    const a = r[k];
    const s = me.stated?.[i];
    const blur = Math.max(0, (a.unc - 8) * 0.28);
    const halo = a.unc * 2;
    const ring =
      s !== null && s !== undefined
        ? `<span class="ring" style="left:${STATED_POS[s]}%" title="${COPY.legendStated}"></span>`
        : '';
    const other = rt
      ? `<span class="dot them" data-x="${rt[k].est.toFixed(1)}" data-blur="${Math.max(0, (rt[k].unc - 8) * 0.28).toFixed(1)}" style="left:50%"></span>`
      : '';
    return `<div class="prow">
      <div class="prow-head"><span class="axis">${AXES[k].label}</span></div>
      <div class="track">
        <span class="line"></span>
        ${ring}
        <span class="halo" data-x="${a.est.toFixed(1)}" style="left:50%;width:${halo.toFixed(1)}%"></span>
        ${other}
        <span class="dot" data-x="${a.est.toFixed(1)}" data-blur="${blur.toFixed(1)}" style="left:50%"></span>
      </div>
      <div class="ends"><span>${AXES[k].lo}</span><span>${AXES[k].hi}</span></div>
    </div>`;
  }).join('');
  const legend = `<div class="legend">
    <span><i class="lg dot-lg"></i>${COPY.legendRevealed}</span>
    ${me.stated && me.stated.some((x) => x !== null) ? `<span><i class="lg ring-lg"></i>${COPY.legendStated}</span>` : ''}
    ${them ? `<span><i class="lg them-lg"></i>${esc(COPY.legendThem(nameOf(them)))}</span>` : ''}
  </div>`;
  return `<div class="portrait">${rows}</div>${legend}`;
}

function sharpen() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = root().querySelectorAll<HTMLElement>('[data-x]');
  const apply = () =>
    els.forEach((e, i) => {
      e.style.transitionDelay = reduce ? '0ms' : `${Math.floor(i / 2) * 140}ms`;
      e.style.left = e.dataset.x + '%';
      if (e.dataset.blur !== undefined) e.style.filter = `blur(${e.dataset.blur}px)`;
    });
  if (reduce || ui.animated) return apply();
  ui.animated = true;
  els.forEach((e) => e.dataset.blur !== undefined && (e.style.filter = 'blur(9px)'));
  requestAnimationFrame(() => requestAnimationFrame(apply));
}

function evidenceLine(qi?: number) {
  if (qi === undefined) return '';
  const a = st.me!.answers[qi] as { p: number };
  return `<p class="evidence"><span>${esc(MOMENTS[qi].s)}</span> You picked: <em>${pickText(qi, a.p)}</em>.</p>`;
}

function trySuggestions(me: Person): { k: AxisKey; side: Side }[] {
  const out: { k: AxisKey; side: Side }[] = [];
  // towards how you see yourself, where your picks fell short of it
  for (const g of gaps(me)) {
    if (g.statedSide !== 0) out.push({ k: g.k, side: g.statedSide });
    else out.push({ k: g.k, side: (g.delta > 0 ? -1 : 1) as Side });
  }
  // then a stretch against your clearest leans
  const r = readAll(me.answers);
  AXIS_KEYS.slice()
    .sort((a, b) => Math.abs(r[b].est - 50) - Math.abs(r[a].est - 50))
    .forEach((k) => {
      const side = sideOf(r[k].est);
      if (side !== 0) out.push({ k, side: (-side) as Side });
    });
  const seen = new Set<string>();
  return out.filter((x) => (seen.has(x.k + x.side) ? false : (seen.add(x.k + x.side), true))).slice(0, 3);
}

function trySection(me: Person) {
  const sugg = trySuggestions(me);
  const all: { k: AxisKey; side: Side }[] = [];
  AXIS_KEYS.forEach((k) => all.push({ k, side: 1 }, { k, side: -1 }));
  const list = ui.tryAll ? all : sugg;
  const chips = list
    .map(({ k, side }, i) => {
      const id = k + side;
      return `<button class="chip${ui.tryPick === id ? ' on' : ''}" style="--i:${i}" data-act="try" data-v="${id}" aria-pressed="${ui.tryPick === id}">${esc(tryLabel(k, side))}</button>`;
    })
    .join('');
  let card = '';
  if (ui.tryPick) {
    const k = ui.tryPick[0] as AxisKey;
    const side = Number(ui.tryPick.slice(1)) as Side;
    card = `<div class="trycard enter"><p class="trytext">${esc(side > 0 ? TRY[k].hi : TRY[k].lo)}</p><p class="hint">${COPY.tryHow}</p></div>`;
  }
  return `<section class="block">
    <h3 class="h3">${COPY.tryHeading}</h3>
    <p class="hint">${COPY.tryIntro}</p>
    <div class="chips">${chips}</div>
    ${ui.tryAll ? '' : `<button class="textlink" data-act="tryAll">Or another direction</button>`}
    ${card}
  </section>`;
}

function result() {
  const me = st.me!;
  const them = st.them && answeredCount(st.them.answers) > 0 ? st.them : undefined;
  const n = answeredCount(me.answers);
  const r = readAll(me.answers);

  // three views: said, picked, guessed
  let gapHtml = '';
  if (me.stated && me.stated.some((x) => x !== null)) {
    const g = gaps(me);
    const gk = new Set(g.map((x) => x.k));
    const matched = AXIS_KEYS.filter((k, i) => !gk.has(k) && me.stated![i] !== null && r[k].ev > 0).map((k) => AXES[k].label);
    gapHtml = g.length
      ? g
          .map(
            (x, i) => `<div class="gap" style="--i:${i}">
              <p class="axis">${AXES[x.k].label}</p>
              <p class="gapline">${esc(gapLine(x.k, x.statedSide, x.revealedSide, x.delta))}</p>
              ${evidenceLine(x.evidence)}
            </div>`,
          )
          .join('') + (matched.length ? `<p class="hint">${esc(COPY.matchedLine(matched))}</p>` : '')
      : `<p class="body">${COPY.noGaps}</p>`;
  } else gapHtml = `<p class="body">${COPY.noStated}</p>`;

  const leans = AXIS_KEYS.filter((k) => r[k].ev > 0)
    .map((k) => {
      const side = sideOf(r[k].est);
      const strong = Math.abs(r[k].est - 50) > r[k].unc + 12;
      return `<li><span class="axis">${AXES[k].label}</span> ${esc(leanLine(k, side, strong))}</li>`;
    })
    .join('');

  let others = '';
  if (st.gm && them) {
    const tn = nameOf(them);
    others = `<section class="block">
      <h3 class="h3">${esc(COPY.othersHeading(tn))}</h3>
      <ul class="glist">${Object.entries(st.gm)
        .map(([qs, g]) => {
          const qi = Number(qs);
          const a = me.answers[qi];
          if (!a || a === 'x') return '';
          return `<li class="gitem"><p class="gscene">${esc(MOMENTS[qi].s)}</p>${
            a.p === g
              ? `<p class="gline right"><span class="tag">${esc(COPY.othersRight(tn))}</span> ${pickText(qi, a.p)}</p>`
              : `<p class="gline">${COPY.youWent}: ${pickText(qi, a.p)}.</p><p class="gline">${esc(COPY.othersLine(tn))}: ${pickText(qi, g)}.</p>`
          }</li>`;
        })
        .join('')}</ul>
    </section>`;
  }

  let pair = '';
  if (them) {
    const tn = nameOf(them);
    const rt = readAll(them.answers);
    const lines = AXIS_KEYS.map((k) => {
      const side = compareAxis(r[k], rt[k]);
      const line = side === 0 ? `${AXES[k].label}: ${COPY.pairLevel}` : `${AXES[k].label}: ${COPY.pairLine(tn, k, side)}`;
      return `<li class="${side === 0 ? 'level' : ''}">${esc(line)}</li>`;
    }).join('');
    pair = `<section class="block">
      <h3 class="h3">${esc(COPY.pairHeading(tn))}</h3>
      <ul class="pairlist">${lines}</ul>
      <p class="hint">${COPY.pairNote}</p>
    </section>`;
  }

  const sendBack =
    st.ask && st.them
      ? `<section class="block share">
          <h3 class="h3">${esc(COPY.sendBack(nameOf(st.them)))}</h3>
          <p class="hint">${esc(COPY.sendBackBody(nameOf(st.them)))}</p>
          <label class="field"><span>${COPY.yourName}</span><input id="like-name-back" autocomplete="given-name" maxlength="30" value="${esc(me.name ?? '')}"></label>
          <button class="pill primary" data-act="sendBack">${esc(COPY.sendBack(nameOf(st.them)))}</button>
          ${ui.backUrl ? `<input class="linkout" readonly value="${esc(ui.backUrl)}" aria-label="Link to send back">` : ''}
        </section>`
      : '';

  return `<section class="screen result">
    <p class="label">${COPY.resultLabel}</p>
    <h1 class="title sm">${them ? esc(COPY.pairHeading(nameOf(them))) : 'What you said, and what you picked'}</h1>
    ${portrait(me, them)}
    <p class="hint">${COPY.momentsSoFar(n)}</p>
    ${n < MAX_MOMENTS ? `<button class="pill quiet" data-act="more">${COPY.sharpen}</button>` : ''}
    ${sendBack}
    ${others}
    ${pair}
    <section class="block"><h3 class="h3">${COPY.gapHeading}</h3>${gapHtml}</section>
    <section class="block"><h3 class="h3">${COPY.leanHeading}</h3><ul class="leans">${leans}</ul></section>
    ${trySection(me)}
    <section class="block share">
      <h3 class="h3">${COPY.guessHeading}</h3>
      <p class="hint">${COPY.guessBody}</p>
      <label class="field"><span>${COPY.guessName}</span><input id="like-name" autocomplete="given-name" maxlength="30" value="${esc(me.name ?? '')}"></label>
      <button class="pill primary" data-act="guessMe">${COPY.guessSend}</button>
      ${ui.shareUrl ? `<input class="linkout" readonly value="${esc(ui.shareUrl)}" aria-label="Guess-me link">` : ''}
    </section>
    <section class="block">
      <h3 class="h3">${COPY.keepHeading}</h3>
      <p class="hint">${COPY.keepBody}</p>
      <button class="pill quiet" data-act="copy">${COPY.copyLink}</button>
    </section>
    <button class="textlink" data-act="restart">${COPY.startOver}</button>
  </section>`;
}

/* ================= ACTIONS ================= */
async function shareOrCopy(url: string, text: string, btn: HTMLElement) {
  try {
    if (navigator.share && matchMedia('(pointer: coarse)').matches) {
      await navigator.share({ title: COPY.title, text, url });
      return;
    }
  } catch {
    /* cancelled share sheet — fall through to copy */
  }
  try {
    await navigator.clipboard.writeText(url);
    btn.textContent = COPY.copied;
  } catch {
    /* clipboard refused; the link is shown on screen anyway */
  }
}

function nameFrom(id: string): string | undefined {
  const v = (document.getElementById(id) as HTMLInputElement | null)?.value.trim().replace(/[~]/g, '');
  return v ? v.slice(0, 30) : undefined;
}

function onClick(e: Event) {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-act]');
  if (!btn || btn.disabled || busy) return;
  const act = btn.dataset.act!;
  const v = btn.dataset.v !== undefined ? Number(btn.dataset.v) : NaN;
  const me = st.me;

  switch (act) {
    case 'how':
      ui.showHow = !ui.showHow;
      return render();
    case 'start':
      st = { me: { answers: [] } };
      ui.stated = [null, null, null, null, null, null];
      break;
    case 'guessStart':
      ui.started = true;
      break;
    case 'stated': {
      ui.stated[Number(btn.dataset.axis)] = v;
      // update in place: no re-render, so the row doesn't jump
      const row = btn.parentElement!;
      row.querySelectorAll('button').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      const go = root().querySelector<HTMLButtonElement>('[data-act="statedGo"]');
      if (go) go.disabled = !ui.stated.every((x) => x !== null);
      return;
    }
    case 'statedGo':
      me!.stated = ui.stated.slice();
      break;
    case 'statedSkip':
      me!.stated = [null, null, null, null, null, null];
      break;
    case 'pick': {
      const qi = ui.qi!;
      me!.answers[qi] = { p: v };
      for (let i = 0; i < qi; i++) if (me!.answers[i] === undefined) me!.answers[i] = null;
      ui.least = qi;
      save();
      return render();
    }
    case 'least': {
      const a = me!.answers[ui.qi!];
      if (a && a !== 'x') a.l = v;
      return advance(btn);
    }
    case 'leastSkip':
      return advance(btn);
    case 'exit': {
      const qi = ui.qi!;
      me!.answers[qi] = 'x';
      for (let i = 0; i < qi; i++) if (me!.answers[i] === undefined) me!.answers[i] = null;
      return advance(btn);
    }
    case 'back':
      ui.least = null;
      ui.qi = Math.max(Math.floor(ui.qi! / BLOCK) * BLOCK, ui.qi! - 1);
      return render();
    case 'guess': {
      const gm = guessMoments(st.them!);
      const qi = gm.find((i) => st.gt?.[i] === undefined)!;
      st.gt = { ...(st.gt ?? {}), [qi]: v };
      break;
    }
    case 'nowYours':
      st.me = { answers: [] };
      ui.stated = [null, null, null, null, null, null];
      break;
    case 'more':
      st.t = Math.min(MAX_MOMENTS, Math.max(target(), answeredCount(me!.answers)) + BLOCK);
      ui.qi = null;
      ui.animated = false;
      break;
    case 'try':
      ui.tryPick = btn.dataset.v!;
      return render(), document.querySelector('.trycard')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    case 'tryAll':
      ui.tryAll = true;
      return render();
    case 'guessMe': {
      me!.name = nameFrom('like-name') ?? me!.name;
      save();
      ui.shareUrl = linkFor({ them: { ...me!, stated: me!.stated }, ask: true });
      render();
      const b = root().querySelector<HTMLElement>('[data-act="guessMe"]')!;
      void shareOrCopy(ui.shareUrl, `Can you guess what ${nameOf(me)} would do?`, b);
      root().querySelector('.linkout')?.scrollIntoView({ block: 'center' });
      return;
    }
    case 'sendBack': {
      me!.name = nameFrom('like-name-back') ?? me!.name;
      save();
      ui.backUrl = linkFor(returnState(st));
      render();
      const b = root().querySelector<HTMLElement>('[data-act="sendBack"]')!;
      void shareOrCopy(ui.backUrl, `${nameOf(me)} guessed you — and did their own.`, b);
      return;
    }
    case 'copy':
      void shareOrCopy(location.href, COPY.title, btn);
      return;
    case 'restart':
      if (!confirm('Start again? Your current link still holds this result if you’ve kept it.')) return;
      st = {};
      Object.assign(ui, { started: false, qi: null, least: null, tryPick: null, tryAll: false, shareUrl: null, backUrl: null, animated: false });
      break;
    default:
      return;
  }
  save();
  render();
}

function advance(btn: HTMLElement) {
  ui.least = null;
  ui.qi = null;
  save();
  const card = btn.closest('.card');
  if (card && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    card.classList.add('leave');
    busy = true;
    setTimeout(() => {
      busy = false;
      render();
    }, 220);
  } else render();
}

function load() {
  st = decodeState(location.hash);
  ui.qi = null;
  ui.least = null;
  ui.animated = false;
  render();
}

export function boot() {
  root().addEventListener('click', onClick);
  window.addEventListener('hashchange', load);
  load();
}
