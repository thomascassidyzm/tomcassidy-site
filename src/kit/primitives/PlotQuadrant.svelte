<script lang="ts">
  /**
   * PlotQuadrant.svelte — the 'quadrant' primitive: a two-axis plane with a
   * draggable marker, preset points you can tap to "fly" the marker there, a
   * parameterised ratio score (y per unit of x, squashed onto 1..max) and
   * verdict copy by score band. Entirely driven by a QuadrantSpec — the axes,
   * win corner, formula constants, verdict bands and points are DATA.
   * Generalises the NERD quadrant that proved the interaction.
   *
   * Standard affordances: pointer drag + tap-a-point, keyboard arrows, aria
   * application role, one quiet entrance, every colour a theme token.
   */
  import type { QuadrantSpec } from '../types';

  interface Props {
    spec: QuadrantSpec;
  }
  let { spec }: Props = $props();

  // plot geometry (viewBox 320 × 320)
  const X0 = 48, X1 = 272, Y0 = 40, Y1 = 264;
  const HALF = (X1 - X0) / 2;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const toX = (vx: number) => X0 + (clamp(vx, 0, 100) / 100) * (X1 - X0);
  const toY = (vy: number) => Y1 - (clamp(vy, 0, 100) / 100) * (Y1 - Y0);
  const fromX = (px: number) => ((clamp(px, X0, X1) - X0) / (X1 - X0)) * 100;
  const fromY = (py: number) => ((Y1 - clamp(py, Y0, Y1)) / (Y1 - Y0)) * 100;

  // the win corner, washed + labelled
  const WIN = {
    tl: { x: X0, y: Y0 },
    tr: { x: X0 + HALF, y: Y0 },
    bl: { x: X0, y: Y0 + HALF },
    br: { x: X0 + HALF, y: Y0 + HALF },
  }[spec.winCorner];
  const winLabelX = spec.winCorner === 'tl' || spec.winCorner === 'bl' ? WIN.x + 8 : WIN.x + HALF - 8;
  const winLabelAnchor = spec.winCorner === 'tl' || spec.winCorner === 'bl' ? 'start' : 'end';
  const winLabelY = spec.winCorner === 'tl' || spec.winCorner === 'tr' ? WIN.y + 15 : WIN.y + HALF - 8;

  // THE SCORE: y per unit of x, squashed onto 1..max.
  const { max: MAX, formula, bands, tones } = spec.score;
  const K = formula.k ?? 1.05;
  const X_FLOOR = formula.xFloor ?? 5;
  function scoreOf(vx: number, vy: number): number {
    const e = Math.max(vx, X_FLOOR) / 100; // floor avoids divide-by-near-zero
    const ratio = vy / 100 / e;
    return clamp(1 + (MAX - 1) * (1 - Math.exp(-K * ratio)), 1, MAX);
  }
  const TONES = tones ?? { win: 0.65 * MAX, mid: 0.35 * MAX };
  const tintOf = (s: number) => (s >= TONES.win ? 'derived' : s >= TONES.mid ? 'contested' : 'open');
  const bandOf = (s: number) => bands.find((b) => s >= b.min) ?? bands[bands.length - 1];

  const initialIdx = spec.initialPoint ?? 0;
  let vx = $state(spec.points[initialIdx]?.x ?? 50);
  let vy = $state(spec.points[initialIdx]?.y ?? 50);
  let activeIdx = $state(spec.points.length ? initialIdx : -1);
  let dragging = $state(false);

  const score = $derived(scoreOf(vx, vy));
  const mx = $derived(toX(vx));
  const my = $derived(toY(vy));
  const tint = $derived(tintOf(score));
  const band = $derived(bandOf(score));
  // verdict line with the {name} token split out so the active point's name is styled
  const lineParts = $derived(band.line.split('{name}'));
  const activeName = $derived(activeIdx >= 0 ? spec.points[activeIdx].name : null);

  // animate the marker flying to a tapped point
  let animId: number | null = null;
  function flyTo(tx: number, ty: number) {
    if (animId) cancelAnimationFrame(animId);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      vx = tx;
      vy = ty;
      return;
    }
    const sx = vx, sy = vy;
    const dur = 460;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = clamp((now - t0) / dur, 0, 1);
      const e = ease(t);
      vx = sx + (tx - sx) * e;
      vy = sy + (ty - sy) * e;
      if (t < 1) animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);
  }

  function selectPoint(i: number) {
    activeIdx = i;
    flyTo(spec.points[i].x, spec.points[i].y);
  }

  // — dragging —
  let svgEl: SVGSVGElement;
  function svgPoint(evt: PointerEvent) {
    const r = svgEl.getBoundingClientRect();
    return { x: ((evt.clientX - r.left) / r.width) * 320, y: ((evt.clientY - r.top) / r.height) * 320 };
  }
  function moveTo(evt: PointerEvent) {
    const p = svgPoint(evt);
    vx = fromX(p.x);
    vy = fromY(p.y);
    activeIdx = -1; // a free drag clears the point identity
  }
  function onDown(evt: PointerEvent) {
    dragging = true;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    try {
      svgEl.setPointerCapture(evt.pointerId);
    } catch {
      /* fine without capture */
    }
    moveTo(evt);
    evt.preventDefault();
  }
  function onMove(evt: PointerEvent) {
    if (!dragging) return;
    moveTo(evt);
    evt.preventDefault();
  }
  function onUp() {
    dragging = false;
  }

  function onKey(e: KeyboardEvent) {
    const step = e.shiftKey ? 10 : 3;
    let used = true;
    if (e.key === 'ArrowLeft') vx = clamp(vx - step, 0, 100);
    else if (e.key === 'ArrowRight') vx = clamp(vx + step, 0, 100);
    else if (e.key === 'ArrowUp') vy = clamp(vy + step, 0, 100);
    else if (e.key === 'ArrowDown') vy = clamp(vy - step, 0, 100);
    else used = false;
    if (used) {
      e.preventDefault();
      activeIdx = -1;
    }
  }
</script>

<svelte:window onpointerup={onUp} onpointercancel={onUp} />

<div class="pq">
  <div class="pq-stage">
    <div class="pq-plot-wrap">
      <svg
        bind:this={svgEl}
        class="pq-plot"
        class:is-grabbing={dragging}
        viewBox="0 0 320 320"
        role="application"
        tabindex="0"
        aria-label={`${spec.winLabel} quadrant. Drag the marker to set ${spec.xAxis.name} on the horizontal axis and ${spec.yAxis.name} on the vertical axis; the score updates live.`}
        onpointerdown={onDown}
        onpointermove={onMove}
        onkeydown={onKey}
      >
        <desc>
          A two-by-two plot. The horizontal axis is {spec.xAxis.name}, {spec.xAxis.low} on the left to
          {spec.xAxis.high} on the right. The vertical axis is {spec.yAxis.name}, {spec.yAxis.low} at the
          bottom to {spec.yAxis.high} at the top. The winning zone is {spec.winLabel}.
        </desc>

        <!-- win wash -->
        <rect class="win-cell" x={WIN.x} y={WIN.y} width={HALF} height={HALF} rx="2" />

        <!-- frame + cross axes -->
        <rect class="frame" x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} rx="3" fill="none" />
        <line class="axis" x1={(X0 + X1) / 2} y1={Y0} x2={(X0 + X1) / 2} y2={Y1} />
        <line class="axis" x1={X0} y1={(Y0 + Y1) / 2} x2={X1} y2={(Y0 + Y1) / 2} />

        <!-- quarter ticks -->
        <line class="axis-tick" x1={X0 + HALF / 2} y1={Y1 - 2} x2={X0 + HALF / 2} y2={Y1 + 2} />
        <line class="axis-tick" x1={X1 - HALF / 2} y1={Y1 - 2} x2={X1 - HALF / 2} y2={Y1 + 2} />
        <line class="axis-tick" x1={X0 - 2} y1={Y0 + HALF / 2} x2={X0 + 2} y2={Y0 + HALF / 2} />
        <line class="axis-tick" x1={X0 - 2} y1={Y1 - HALF / 2} x2={X0 + 2} y2={Y1 - HALF / 2} />

        <!-- win label -->
        <text class="win-label" x={winLabelX} y={winLabelY} text-anchor={winLabelAnchor}>{spec.winLabel}</text>

        <!-- axis pole labels -->
        <text class="axis-label" x={X0} y={Y1 + 16} text-anchor="start">{spec.xAxis.low}</text>
        <text class="axis-label" x={X1} y={Y1 + 16} text-anchor="end">{spec.xAxis.high}</text>
        <text class="axis-name" x={(X0 + X1) / 2} y={Y1 + 29} text-anchor="middle">{spec.xAxis.name}</text>

        <text class="axis-label" x={X0 - 8} y={Y0 + 4} text-anchor="end">{spec.yAxis.high}</text>
        <text class="axis-label" x={X0 - 8} y={Y1} text-anchor="end">{spec.yAxis.low}</text>
        <text class="axis-name" x="20" y={(Y0 + Y1) / 2} text-anchor="middle" transform={`rotate(-90 20 ${(Y0 + Y1) / 2})`}>{spec.yAxis.name}</text>

        <!-- preset points on the plane -->
        {#each spec.points as p, i (p.name)}
          <circle
            class="ghost"
            class:is-active={activeIdx === i}
            r="4.2"
            cx={toX(p.x)}
            cy={toY(p.y)}
            role="button"
            aria-label={p.name}
            onclick={(e) => {
              e.stopPropagation();
              selectPoint(i);
            }}
            onpointerdown={(e) => e.stopPropagation()}
          ></circle>
        {/each}

        <!-- lead lines + marker -->
        <line class="lead-line" x1={mx} y1={my} x2={mx} y2={Y1} />
        <line class="lead-line" x1={X0} y1={my} x2={mx} y2={my} />
        <g class="marker" transform={`translate(${mx} ${my})`} style={`--tint: var(--${tint})`}>
          <circle class="marker-halo" r="17"></circle>
          <circle class="marker-core" r="13"></circle>
          <text class="marker-score" text-anchor="middle" dy="4.2">{Math.round(score)}</text>
        </g>
      </svg>
    </div>

  </div>

  <!-- the readout — never a sidecar; a full-width band beneath the plot -->
  <div class="pq-readout" style={`--tint: var(--${tint})`}>
    <div class="ro-main">
      <p class="ro-kicker">{spec.score.kicker}</p>
      <div class="ro-score"><span class="big">{(Math.round(score * 10) / 10).toFixed(1)}</span><span class="deno">/ {MAX}</span></div>
    </div>

    <div class="ro-verdict">
      <p class="ro-verdict-word">{band.word}</p>
      <p class="ro-verdict-line" aria-live="polite">
        {#each lineParts as part, i (i)}{#if i > 0}{#if activeName}<span class="point-name">{activeName}</span>{:else}This{/if}{/if}{part}{/each}
      </p>
    </div>

    <div class="ro-bars">
      <div class="ro-bar bar-y">
        <span class="lab">{spec.yAxis.name}</span>
        <span class="track"><span class="fill" style={`width:${clamp(vy, 0, 100)}%`}></span></span>
        <span class="num">{Math.round(vy)}</span>
      </div>
      <div class="ro-bar bar-x">
        <span class="lab">{spec.xAxis.name}</span>
        <span class="track"><span class="fill" style={`width:${clamp(vx, 0, 100)}%`}></span></span>
        <span class="num">{Math.round(vx)}</span>
      </div>
    </div>
  </div>

  {#if spec.points.length}
    <div class="pq-chips">
      {#each spec.points as p, i (p.name)}
        <button class="chip" class:is-active={activeIdx === i} type="button" style={`--ci:${i}; --dot: var(--${tintOf(scoreOf(p.x, p.y))})`} onclick={() => selectPoint(i)}>
          <span class="dot" aria-hidden="true"></span>{p.name}
        </button>
      {/each}
    </div>
  {/if}
  {#if spec.hint}
    <p class="pq-hint">{spec.hint}</p>
  {/if}
</div>

<style>
  .pq {
    /* An instrument, not an illustration — break out wider than the prose. */
    width: min(900px, 94vw);
    margin: 2.5rem 0;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-body);
    color: var(--text-primary);
    -webkit-tap-highlight-color: transparent;
  }

  /* ---- the plot — the main story, nothing beside it ---- */
  .pq-plot-wrap {
    position: relative;
    width: min(100%, 600px);
    margin: 0 auto;
    border: 1px solid var(--hairline);
    border-radius: 6px;
    background: var(--bg-elevated);
    overflow: hidden;
  }
  svg.pq-plot {
    display: block;
    width: 100%;
    height: auto;
    touch-action: none;
    cursor: grab;
    outline: none;
  }
  svg.pq-plot.is-grabbing { cursor: grabbing; }
  svg.pq-plot:focus-visible { box-shadow: inset 0 0 0 2px var(--established); }

  .win-cell { fill: var(--derived-wash); }
  .frame, .axis { stroke: var(--hairline); stroke-width: 1; }
  .axis-tick { stroke: var(--hairline); stroke-width: 1; opacity: 0.55; }

  .win-label {
    font-family: var(--font-mono);
    font-size: 8.4px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    fill: var(--derived);
  }
  .axis-label {
    font-family: var(--font-mono);
    font-size: 8.6px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    fill: var(--text-muted);
  }
  .axis-name {
    font-family: var(--font-mono);
    font-size: 8.2px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    fill: var(--text-secondary);
  }

  /* preset point dots on the plane */
  .ghost {
    fill: var(--surface);
    stroke: var(--hairline);
    stroke-width: 1;
    cursor: pointer;
    transition: r 0.18s ease, fill 0.18s ease;
  }
  .ghost:hover { fill: var(--depth-3); r: 5.4px; }
  .ghost.is-active { fill: var(--text-muted); stroke: none; }

  /* the marker — tinted through the --tint channel */
  .lead-line { stroke: var(--text-muted); stroke-width: 1; stroke-dasharray: 2 3; opacity: 0.5; }
  .marker-halo { fill: var(--bg-elevated); stroke: var(--tint); stroke-width: 1.25; }
  .marker-core { fill: var(--tint); stroke: var(--bg-elevated); stroke-width: 1.5; }
  .marker-score {
    font-family: var(--font-mono);
    font-weight: 600;
    font-size: 13px;
    fill: var(--bg-elevated);
    pointer-events: none;
  }

  /* ---- readout band beneath the plot ---- */
  .pq-readout {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) minmax(220px, 280px);
    gap: 1rem 2rem;
    align-items: center;
    margin-top: 1rem;
    padding: 1rem clamp(1rem, 3vw, 1.6rem);
    border: 1px solid var(--hairline);
    border-radius: 6px;
    background: var(--bg-elevated);
  }
  @media (max-width: 680px) {
    .pq-readout { grid-template-columns: 1fr; }
  }

  .ro-kicker {
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0 0 0.4rem;
  }

  .ro-score {
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
    font-family: var(--font-mono);
    font-weight: 600;
    line-height: 0.92;
    color: var(--tint);
    transition: color 0.25s ease;
  }
  .ro-score .big { font-size: clamp(3rem, 11vw, 4.3rem); }
  .ro-score .deno { font-size: 1.2rem; color: var(--text-muted); font-weight: 500; }

  .ro-verdict-word {
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 4vw, 1.7rem);
    font-weight: 500;
    color: var(--tint);
    margin: 0.1rem 0 0.15rem;
    transition: color 0.25s ease;
  }
  .ro-verdict-line {
    font-family: var(--font-body);
    font-size: 0.92rem;
    line-height: 1.45;
    color: var(--text-secondary);
    margin: 0;
    min-height: 2.6em;
  }
  .ro-verdict-line .point-name {
    font-style: italic;
    color: var(--text-primary);
  }

  /* the two component bars */
  .ro-bars { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.2rem; }
  .ro-bar { display: grid; grid-template-columns: 4.5em 1fr 2.2em; align-items: center; gap: 0.55rem; }
  .ro-bar .lab {
    font-family: var(--font-mono);
    font-size: 8.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ro-bar .track {
    height: 6px;
    border-radius: 3px;
    background: var(--depth-3);
    overflow: hidden;
  }
  .ro-bar .fill { display: block; height: 100%; border-radius: 3px; transition: width 0.32s cubic-bezier(0.2, 0.7, 0.2, 1); }
  .ro-bar.bar-y .fill { background: var(--established); }
  .ro-bar.bar-x .fill { background: var(--contested); }
  .ro-bar .num {
    font-family: var(--font-mono);
    font-size: 9.5px;
    color: var(--text-secondary);
    text-align: right;
  }

  /* ---- point chips ---- */
  .pq-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    margin-top: 1rem;
  }
  .chip {
    appearance: none;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.02em;
    color: var(--text-secondary);
    background: var(--surface);
    border: 1px solid var(--hairline);
    border-radius: 999px;
    padding: 0.34rem 0.78rem;
    cursor: pointer;
    transition: background 0.16s ease, color 0.16s ease, border-color 0.16s ease, transform 0.1s ease;
  }
  .chip:hover { background: var(--depth-3); color: var(--text-primary); }
  .chip:active { transform: translateY(1px); }
  .chip.is-active {
    color: var(--text-primary);
    border-color: var(--text-muted);
    background: var(--depth-3);
  }
  .chip .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 0.45rem;
    vertical-align: middle;
    background: var(--dot);
  }

  .pq-hint {
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    margin: 0.9rem 0 0;
    text-align: center;
  }

  @media (prefers-reduced-motion: no-preference) {
    .pq-plot-wrap,
    .pq-readout { animation: pq-rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) backwards; }
    .pq-readout { animation-delay: 0.08s; }
    .chip { animation: pq-rise 0.5s ease backwards; animation-delay: calc(0.18s + var(--ci, 0) * 0.04s); }
    @keyframes pq-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  }
</style>
