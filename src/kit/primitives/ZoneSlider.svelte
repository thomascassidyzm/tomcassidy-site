<script lang="ts">
  /**
   * ZoneSlider.svelte — the 'slider' primitive: a pole-to-pole continuum you
   * drive, with named stops, tone zones carrying verdict copy, an optional lit
   * sweet-spot band, and optional model curves (each a declarative fall:
   * value(v) = max(0, 1 − v/zeroAt)^power) with a tone-tinted gap fill between
   * two of them. Entirely driven by a SliderSpec — the stops, zones, curves
   * and coaching copy are DATA. Generalises the hunger-vs-appetite meter that
   * proved the interaction.
   *
   * Standard affordances: pointer drag + tap-to-set, full slider keyboard map,
   * reset, real aria slider role, one quiet entrance, every colour a token.
   */
  import { onMount } from 'svelte';
  import type { SliderSpec, SliderTone } from '../types';

  interface Props {
    spec: SliderSpec;
  }
  let { spec }: Props = $props();

  // ---- geometry (viewBox 860 × 360) ----
  const X0 = 70, X1 = 790;
  const Y_TOP = 64, Y_FLOOR = 252;
  const W = X1 - X0, H = Y_FLOOR - Y_TOP;
  const toX = (v: number) => X0 + v * W;
  const toY = (n: number) => Y_FLOOR - n * H;
  const fromX = (px: number) => Math.max(0, Math.min(1, (px - X0) / W));
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

  // ---- model curves: value(v) = max(0, 1 − v/zeroAt)^power ----
  const curves = spec.curves ?? [];
  const fnOf = new Map(
    curves.map((c) => [
      c.id,
      (v: number) => Math.pow(Math.max(0, 1 - v / c.fall.zeroAt), c.fall.power),
    ]),
  );

  const N = 64;
  const sample = (fn: (v: number) => number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const v = i / N;
      pts.push([toX(v), toY(fn(v))]);
    }
    return pts;
  };
  const smoothPath = (pts: [number, number][]) => {
    let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      d += ` Q${x0.toFixed(2)},${y0.toFixed(2)} ${((x0 + x1) / 2).toFixed(2)},${((y0 + y1) / 2).toFixed(2)}`;
    }
    const last = pts[pts.length - 1];
    d += ` L${last[0].toFixed(2)},${last[1].toFixed(2)}`;
    return d;
  };
  const curvePaths = curves.map((c) => ({ ...c, d: smoothPath(sample(fnOf.get(c.id)!)) }));

  // ---- live state ----
  let current = $state(clamp01(spec.initial));
  let dragging = $state(false);

  const zone = $derived(spec.zones.find((z) => current <= z.upTo) ?? spec.zones[spec.zones.length - 1]);
  const toneClass: Record<SliderTone, string> = { ok: 'z-ok', over: 'z-over', far: 'z-far' };

  const rideFn = $derived(
    (spec.thumbRides && fnOf.get(spec.thumbRides)) || (() => 0),
  );
  const thumbX = $derived(toX(current));
  const thumbY = $derived(toY(rideFn(current)));

  const inBand = $derived(!!spec.band && current >= spec.band.lo && current <= spec.band.hi);

  const nearestStop = $derived.by(() => {
    let best = spec.stops[0];
    let bd = Infinity;
    for (const s of spec.stops) {
      const d = Math.abs(s.v - current);
      if (d < bd) {
        bd = d;
        best = s;
      }
    }
    return best;
  });

  // gap fill: the area between two named curves, from 0 to the read-out
  const gapPath = $derived.by(() => {
    if (!spec.gap) return '';
    const top = fnOf.get(spec.gap.top);
    const bottom = fnOf.get(spec.gap.bottom);
    if (!top || !bottom) return '';
    const M = 48;
    const vMax = Math.max(0.0001, current);
    const tops: string[] = [];
    const bots: string[] = [];
    for (let i = 0; i <= M; i++) {
      const v = (i / M) * vMax;
      tops.push(`${toX(v).toFixed(2)},${toY(top(v)).toFixed(2)}`);
      bots.unshift(`${toX(v).toFixed(2)},${toY(bottom(v)).toFixed(2)}`);
    }
    return `M${tops[0]} L${tops.slice(1).join(' L')} L${bots.join(' L')} Z`;
  });

  // ---- pointer drive ----
  let svgEl: SVGSVGElement;
  const clientToV = (clientX: number) => {
    const r = svgEl.getBoundingClientRect();
    return fromX(((clientX - r.left) / r.width) * 860);
  };
  function onDown(e: PointerEvent) {
    dragging = true;
    current = clientToV(e.clientX);
    trackEl?.focus({ preventScroll: true });
    if (e.cancelable) e.preventDefault();
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return;
    current = clientToV(e.clientX);
    if (e.cancelable) e.preventDefault();
  }
  function onUp() {
    dragging = false;
  }
  function onPlotClick(e: MouseEvent) {
    current = clientToV(e.clientX);
  }

  // ---- keyboard (full slider map) ----
  let trackEl: SVGGElement | null = null;
  function onKey(e: KeyboardEvent) {
    const step = e.shiftKey ? 0.1 : 0.02;
    let handled = true;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') current = clamp01(current + step);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') current = clamp01(current - step);
    else if (e.key === 'Home') current = 0;
    else if (e.key === 'End') current = 1;
    else if (e.key === 'PageUp') current = clamp01(current + 0.1);
    else if (e.key === 'PageDown') current = clamp01(current - 0.1);
    else if (e.key === 'Enter' || e.key === ' ') current = clamp01(spec.initial);
    else handled = false;
    if (handled && e.cancelable) e.preventDefault();
  }

  // entrance draw-in needs each curve's real length
  let pathEls: (SVGPathElement | null)[] = $state([]);
  onMount(() => {
    pathEls.forEach((p) => {
      try {
        p?.style.setProperty('--len', `${Math.ceil(p.getTotalLength())}`);
      } catch {
        /* getTotalLength unavailable — the CSS fallback length is fine */
      }
    });
  });
</script>

<svelte:window onpointermove={onMove} onpointerup={onUp} onpointercancel={onUp} />

<div class="zs {toneClass[zone.tone]}">
  <svg
    bind:this={svgEl}
    class="zs-plot"
    viewBox="0 0 860 360"
    role="group"
    aria-label={spec.ariaLabel ?? spec.kicker}
    onclick={onPlotClick}
  >
    <!-- floor -->
    <line class="zs-floor zs-anim" style="--d:120" x1={X0} y1={Y_FLOOR} x2={X1} y2={Y_FLOOR}></line>

    <!-- sweet-spot band -->
    {#if spec.band}
      <g>
        <rect
          class="zs-band zs-anim"
          class:is-live={inBand}
          style="--d:240"
          x={toX(spec.band.lo).toFixed(1)}
          y={Y_TOP}
          width={(toX(spec.band.hi) - toX(spec.band.lo)).toFixed(1)}
          height={Y_FLOOR - Y_TOP}
          rx="2"
        ></rect>
        <text
          class="zs-band-cap zs-anim"
          class:is-live={inBand}
          style="--d:300"
          x={((toX(spec.band.lo) + toX(spec.band.hi)) / 2).toFixed(1)}
          y={Y_TOP - 8}
          text-anchor="middle">{spec.band.cap}</text
        >
      </g>
    {/if}

    <!-- the gap between the curves, toned by zone -->
    {#if spec.gap}
      <path class="zs-gap zs-anim" style="--d:560" d={gapPath}></path>
    {/if}

    <!-- the model curves, drawn in -->
    {#each curvePaths as c, i (c.id)}
      <path
        bind:this={pathEls[i]}
        class="zs-curve zs-draw"
        style={`--d:${420 + i * 100}; --len:900; --pig: var(--${c.pigment})`}
        d={c.d}
      ></path>
    {/each}
    {#each curvePaths as c (c.id)}
      <text
        class="zs-curve-tag zs-anim"
        style={`--d:760; --pig: var(--${c.pigment})`}
        x={X0 + 16}
        y={(toY(fnOf.get(c.id)!(0.06)) + (c.id === spec.gap?.bottom ? 18 : -10)).toFixed(1)}
        >{c.label}</text
      >
    {/each}

    <!-- moving read-out: line + thumb (focusable slider) -->
    <g
      bind:this={trackEl}
      class="zs-track"
      class:is-drag={dragging}
      tabindex="0"
      role="slider"
      aria-label={spec.ariaLabel ?? spec.kicker}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={Math.round(current * 100)}
      aria-valuetext={nearestStop.label}
      onkeydown={onKey}
    >
      <rect class="zs-focus-ring" x={X0 - 8} y={Y_TOP - 14} width={W + 16} height={H + 38} rx="6"></rect>
      <line class="zs-now zs-anim" style="--d:640" x1={thumbX.toFixed(1)} y1={(thumbY - 13).toFixed(1)} x2={thumbX.toFixed(1)} y2={Y_FLOOR}></line>
      <circle class="zs-thumb zs-anim" style="--d:640" cx={thumbX.toFixed(1)} cy={thumbY.toFixed(1)} r="13"></circle>
      <text class="zs-thumb-core zs-anim" style="--d:640" x={thumbX.toFixed(1)} y={(thumbY + 4.5).toFixed(1)} text-anchor="middle">●</text>
      <rect class="zs-hit" x={X0 - 10} y={Y_TOP - 20} width={W + 20} height={H + 44} onpointerdown={onDown}></rect>
    </g>

    <!-- the stops -->
    <g>
      {#each spec.stops as s (s.v)}
        {@const x = toX(s.v)}
        {@const anchor = s.v === 0 ? 'start' : s.v === 1 ? 'end' : 'middle'}
        {@const words = s.label.split(' ')}
        <line class="zs-tick zs-anim" style="--d:880" x1={x} x2={x} y1={Y_FLOOR} y2={Y_FLOOR + 7}></line>
        <text class="zs-tick-label zs-anim" class:is-here={nearestStop === s} style="--d:880" text-anchor={anchor} x={x} y={Y_FLOOR + 20}>
          {#if words.length > 1 && anchor === 'middle'}
            <tspan x={x} dy="0">{words[0]}</tspan>
            <tspan x={x} dy="11">{words.slice(1).join(' ')}</tspan>
          {:else}
            {s.label}
          {/if}
        </text>
      {/each}
    </g>

    <text class="zs-axis-name zs-anim" style="--d:840" x={X0} y="320" text-anchor="start">{spec.axis.low}</text>
    <text class="zs-axis-name zs-anim" style="--d:840" x={X1} y="320" text-anchor="end">{spec.axis.high}</text>
  </svg>

  <div class="zs-msg">
    <span class="zs-verdict">{zone.verdict}</span>
    <p class="zs-say">{@html zone.say}</p>
    <p class="zs-sub">{zone.sub}</p>
    <button class="zs-reset" type="button" onclick={() => (current = clamp01(spec.initial))}>
      {spec.resetLabel ?? '↺ reset'}
    </button>
  </div>
</div>

<style>
  .zs {
    font-family: var(--font-body);
    color: var(--text-primary);
    width: min(880px, 95vw);
    margin: 2.5rem 0;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    user-select: none;
    -webkit-user-select: none;
  }

  /* ---- the plot ---- */
  .zs-plot { display: block; width: 100%; height: auto; overflow: visible; }
  .zs-floor { stroke: var(--hairline); stroke-width: 1; }

  /* sweet-spot band */
  .zs-band {
    fill: var(--derived-wash);
    stroke: var(--derived);
    stroke-width: 1;
    stroke-dasharray: 3 3;
    opacity: 0.35;
    transition: opacity 0.35s ease, fill 0.35s ease;
  }
  .zs-band.is-live { opacity: 1; stroke-dasharray: none; }
  .zs-band-cap {
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    fill: var(--derived);
    opacity: 0.7;
    transition: opacity 0.35s ease;
  }
  .zs-band-cap.is-live { opacity: 1; }

  /* curves — pigment from data through the --pig channel */
  .zs-curve {
    fill: none;
    stroke: var(--pig);
    stroke-width: 2.25;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .zs-curve-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    fill: var(--pig);
  }

  /* the gap fill — toned by the zone you're in */
  .zs-gap { transition: fill 0.45s ease; }
  .z-ok .zs-gap { fill: var(--derived-wash); }
  .z-over .zs-gap { fill: var(--contested-wash); }
  .z-far .zs-gap { fill: var(--open-wash); }

  /* the moving read-out line + thumb */
  .zs-now { stroke: var(--text-primary); stroke-width: 1.25; opacity: 0.55; }
  .zs-hit { fill: transparent; cursor: grab; touch-action: none; }
  .zs-track.is-drag .zs-hit { cursor: grabbing; }
  .zs-thumb {
    fill: var(--bg-elevated);
    stroke-width: 2;
    transition: stroke 0.35s ease;
  }
  .zs-thumb-core {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    transition: fill 0.35s ease;
  }
  .z-ok .zs-thumb { stroke: var(--derived); }
  .z-ok .zs-thumb-core { fill: var(--derived); }
  .z-over .zs-thumb { stroke: var(--contested); }
  .z-over .zs-thumb-core { fill: var(--contested); }
  .z-far .zs-thumb { stroke: var(--open); }
  .z-far .zs-thumb-core { fill: var(--open); }

  .zs-track:focus { outline: none; }
  .zs-track:focus-visible .zs-thumb { stroke-width: 2.5; }
  .zs-focus-ring {
    fill: none;
    stroke: var(--text-muted);
    stroke-width: 1;
    stroke-dasharray: 2 3;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  .zs-track:focus-visible .zs-focus-ring { opacity: 0.8; }

  /* stop ticks */
  .zs-tick { stroke: var(--hairline); stroke-width: 1; }
  .zs-tick-label {
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    fill: var(--text-muted);
    transition: fill 0.3s ease;
  }
  .zs-tick-label.is-here { fill: var(--text-primary); }
  .zs-axis-name {
    font-family: var(--font-mono);
    font-size: 9.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    fill: var(--text-muted);
  }

  /* ---- message panel ---- */
  .zs-msg {
    margin: 1.15rem 0.25rem 0;
    border-top: 1px solid var(--hairline);
    padding-top: 0.95rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0 1rem;
    align-items: start;
  }
  .zs-verdict {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 0.32em 0.7em;
    border-radius: 2px;
    transition: background 0.35s ease, color 0.35s ease;
    align-self: start;
  }
  .z-ok .zs-verdict { background: var(--derived-chip); color: var(--bg); }
  .z-over .zs-verdict { background: var(--contested-chip); color: var(--bg); }
  .z-far .zs-verdict { background: var(--open-chip); color: var(--bg); }

  .zs-say {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: clamp(1.15rem, 1rem + 0.9vw, 1.7rem);
    line-height: 1.22;
    font-weight: 420;
    color: var(--text-primary);
    margin: 0.05em 0 0;
    min-height: 2.4em;
  }
  .zs-say :global(em) {
    font-style: italic;
    transition: color 0.35s ease;
  }
  .z-ok .zs-say :global(em) { color: var(--derived); }
  .z-over .zs-say :global(em) { color: var(--contested); }
  .z-far .zs-say :global(em) { color: var(--open); }

  .zs-sub {
    grid-column: 2;
    font-family: var(--font-body);
    font-size: 0.92rem;
    line-height: 1.45;
    color: var(--text-secondary);
    margin: 0.5rem 0 0;
    max-width: 46ch;
  }

  .zs-reset {
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 0.9rem;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    background: transparent;
    border: 1px solid var(--hairline);
    border-radius: 2px;
    padding: 0.45em 0.85em;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  .zs-reset:hover { color: var(--derived); border-color: var(--derived); }

  /* quiet entrance, then stillness */
  @media (prefers-reduced-motion: no-preference) {
    .zs-anim {
      opacity: 0;
      animation: zs-rise 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      animation-delay: calc(var(--d, 0) * 1ms);
    }
    .zs-draw {
      stroke-dasharray: var(--len, 1200);
      stroke-dashoffset: var(--len, 1200);
      animation: zs-draw 0.95s cubic-bezier(0.3, 0.7, 0.2, 1) forwards;
      animation-delay: calc(var(--d, 0) * 1ms);
    }
    @keyframes zs-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @keyframes zs-draw { to { stroke-dashoffset: 0; } }
  }
</style>
