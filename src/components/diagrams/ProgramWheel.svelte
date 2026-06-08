<script lang="ts">
  /**
   * ProgramWheel.svelte — the Reason-Ability wheel as a living object: diagram,
   * navigator, and coach surface in one. Driven entirely by a Program data
   * object + the shared wheel-geometry helper, so the SAME component draws any
   * four-domain programme (eating now; wealth, faith, shape later) from data
   * alone. Theme-aware: every colour is a design token via the `--pig` channel,
   * so it flips light/dark untouched — and so Svelte's CSS pruner never strips a
   * dynamically-chosen pigment class.
   *
   * "This week" coach mode: once you Begin a programme, today becomes Week 1 and
   * the wheel opens each visit on the week you're actually on — the reason to
   * re-open it. Enrolment is a single localStorage date; no account.
   *
   * Hydrate as an island with `client:visible`; the static .astro figure remains
   * the no-JS / print baseline.
   */
  import { onMount } from 'svelte';
  import { buildWheel, DEFAULT_DIMS, type WheelDims } from '@/lib/wheel-geometry';
  import type { Program } from '@/lib/programs/types';

  interface Props {
    program: Program;
    dims?: WheelDims;
    /** ms per step when the rotation is playing. */
    interval?: number;
  }
  let { program, dims = DEFAULT_DIMS, interval = 1500 }: Props = $props();

  const layout = $derived(buildWheel(program, dims));
  const domainCount = $derived(program.domains.length);
  const vbW = $derived(dims.cx * 2);
  const vbH = $derived(dims.cy * 2 + 60);

  // null = the hub (Algorithm Zero) is selected; a number = that week.
  let selectedWeek = $state<number | null>(null);
  let playing = $state(false);

  // "This week" enrolment — today-as-week-1, persisted as one date.
  let currentWeek = $state<number | null>(null);
  const enrollKey = `re-enrol:${program.slug}`;

  function select(week: number | null) {
    selectedWeek = week;
  }
  function step(dir: 1 | -1) {
    const n = layout.n;
    if (selectedWeek == null) {
      selectedWeek = dir === 1 ? 1 : n;
    } else {
      selectedWeek = ((selectedWeek - 1 + dir + n) % n) + 1;
    }
  }
  function togglePlay() {
    playing = !playing;
  }
  function begin() {
    const now = Date.now();
    try {
      localStorage.setItem(enrollKey, String(now));
    } catch (e) {
      /* private mode — fine, just no persistence */
    }
    currentWeek = 1;
    selectedWeek = 1;
    playing = false;
  }
  function leave() {
    try {
      localStorage.removeItem(enrollKey);
    } catch (e) {
      /* noop */
    }
    currentWeek = null;
    selectedWeek = null;
  }

  onMount(() => {
    try {
      const raw = localStorage.getItem(enrollKey);
      if (raw) {
        const start = parseInt(raw, 10);
        if (!Number.isNaN(start)) {
          const days = Math.floor((Date.now() - start) / 86_400_000);
          currentWeek = (Math.floor(days / 7) % layout.n) + 1;
          selectedWeek = currentWeek; // open on the week you're actually on
        }
      }
    } catch (e) {
      /* localStorage unavailable — stay on the hub */
    }
  });

  // The play loop subscribes ONLY to `playing` (selectedWeek is read lazily
  // inside the interval, so the timer isn't torn down on every tick).
  $effect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const n = layout.n;
      selectedWeek = selectedWeek == null ? 1 : (selectedWeek % n) + 1;
    }, interval);
    return () => clearInterval(id);
  });

  const selectedSlice = $derived(
    selectedWeek == null ? null : layout.slices.find((s) => s.week === selectedWeek) ?? null,
  );
  const cycleNum = $derived(
    selectedWeek == null ? null : Math.floor((selectedWeek - 1) / domainCount) + 1,
  );
  const cycleCount = $derived(program.cycles);
  const isThisWeek = $derived(selectedWeek != null && selectedWeek === currentWeek);

  // The coach payload shown in the side panel — hub when nothing is selected.
  const coachView = $derived(
    selectedSlice
      ? {
          kicker: `${isThisWeek ? 'This week · ' : ''}Week ${selectedSlice.week} · ${selectedSlice.domainQuestion}`,
          name: selectedSlice.name,
          wisdom: selectedSlice.coach.wisdom,
          pigment: selectedSlice.pigment as string,
        }
      : {
          kicker: 'Algorithm Zero · always on',
          name: program.hub.algorithmName,
          wisdom: program.hub.coach.wisdom,
          pigment: '' as string,
        },
  );

  function onSliceKey(e: KeyboardEvent, week: number) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(week);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      step(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      step(-1);
    }
  }
</script>

<figure class="pw" style={`--pig-current: var(--${coachView.pigment || 'text-muted'})`}>
  <div class="pw-stage">
    <svg
      class="pw-svg"
      viewBox={`0 0 ${vbW} ${vbH}`}
      role="group"
      aria-label={`${program.title} — interactive ${program.domains.length}×${program.cycles} wheel`}
    >
      <!-- segments -->
      {#each layout.slices as s (s.week)}
        <path
          class="seg"
          class:is-selected={selectedWeek === s.week}
          class:is-current={currentWeek === s.week}
          class:dim={selectedWeek != null && selectedWeek !== s.week}
          d={s.path}
          style={`--i:${s.order}; --pig: var(--${s.pigment}); --pig-wash: var(--${s.pigment}-wash); --pig-chip: var(--${s.pigment}-chip)`}
          tabindex="0"
          role="button"
          aria-pressed={selectedWeek === s.week}
          aria-label={`Week ${s.week}: ${s.name}`}
          onclick={() => select(s.week)}
          onkeydown={(e) => onSliceKey(e, s.week)}
        ></path>
      {/each}

      <!-- domain rim arcs + labels -->
      {#each layout.domainArcs as q (q.name)}
        <path class="quad-arc" d={q.arc} fill="none" style={`--pig: var(--${q.pigment})`}></path>
      {/each}
      {#each layout.domainArcs as q (q.name)}
        <text class="quad-label" x={q.lx} y={q.ly} text-anchor="middle" style={`--pig: var(--${q.pigment})`}>{q.name}</text>
      {/each}

      <!-- hub: Algorithm Zero -->
      <circle
        class="hub"
        class:is-selected={selectedWeek == null}
        cx={dims.cx}
        cy={dims.cy}
        r={dims.ri - 3}
        tabindex="0"
        role="button"
        aria-pressed={selectedWeek == null}
        aria-label={`Algorithm Zero: ${program.hub.algorithmName}`}
        onclick={() => select(null)}
        onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(null); } }}
      ></circle>
      <g class="num num--hub">
        <circle class="num-dot" cx={dims.cx} cy={dims.cy - 28} r="10.5"></circle>
        <text class="num-text" x={dims.cx} y={dims.cy - 24} text-anchor="middle">0</text>
      </g>
      {#each program.hub.label as line, k (line)}
        <text class="hub-label" x={dims.cx} y={dims.cy + 6 + k * 21} text-anchor="middle">{line}</text>
      {/each}

      <!-- segment labels -->
      {#each layout.slices as s (s.week)}
        <text class="label" class:dim={selectedWeek != null && selectedWeek !== s.week} x={s.lx} y={s.ly} text-anchor="middle">
          {#each s.lines as line, k (line)}
            <tspan x={s.lx} dy={k === 0 ? -((s.lines.length - 1) * 11) / 2 + 3.5 : 11}>{line}</tspan>
          {/each}
        </text>
      {/each}

      <!-- numerals -->
      {#each layout.slices as s (s.week)}
        <g class="num" style={`--pig: var(--${s.pigment})`}>
          <circle class="num-dot" class:is-selected={selectedWeek === s.week} class:is-current={currentWeek === s.week} cx={s.nx} cy={s.ny} r="10"></circle>
          <text class="num-text" x={s.nx} y={s.ny + 3.5} text-anchor="middle">{s.week}</text>
        </g>
      {/each}
    </svg>

    <!-- coach panel — the wheel's third life -->
    <aside class="pw-coach" class:has-pig={!!coachView.pigment} class:is-week={isThisWeek} aria-live="polite">
      <p class="coach-kicker">{coachView.kicker}</p>
      <h3 class="coach-name">{coachView.name}</h3>
      <p class="coach-wisdom">{coachView.wisdom}</p>
    </aside>
  </div>

  <!-- controls -->
  <div class="pw-controls">
    {#if currentWeek == null}
      <button class="ctl-btn ctl-begin" type="button" onclick={begin}>● Begin — make today Week 1</button>
    {:else}
      <span class="ctl-week">● This week · Week {currentWeek}</span>
      <button class="ctl-btn ctl-here" type="button" onclick={() => select(currentWeek)}>Take me to this week</button>
      <button class="ctl-x" type="button" onclick={leave} aria-label="Leave the programme">✕</button>
    {/if}
    <button class="ctl-btn ctl-play" class:is-on={playing} type="button" onclick={togglePlay} aria-pressed={playing}>
      {playing ? '❚❚ Pause' : '▶ Play rotation'}
    </button>
    <button class="ctl-btn" type="button" onclick={() => step(-1)} aria-label="Previous week">◀ Prev</button>
    <button class="ctl-btn" type="button" onclick={() => step(1)} aria-label="Next week">Next ▶</button>
    <span class="ctl-readout">
      {#if selectedWeek == null}
        Algorithm Zero
      {:else}
        Cycle {cycleNum} of {cycleCount} · Week {selectedWeek}/{layout.n} · {selectedSlice?.domain}
      {/if}
    </span>
  </div>

  <figcaption class="pw-caption">
    Click any slice to read its algorithm and word of wisdom; press Play to watch the focus walk the weeks and cycle the four domains in Franklin rotation. Begin the programme and the wheel opens on the week you're on.
  </figcaption>
</figure>

<style>
  .pw {
    width: min(960px, 95vw);
    margin: 2.5rem 0;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .pw-stage {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(220px, 1fr);
    gap: 1.5rem;
    align-items: center;
  }
  @media (max-width: 720px) {
    .pw-stage { grid-template-columns: 1fr; }
  }

  .pw-svg { display: block; width: 100%; height: auto; overflow: visible; }

  /* Segments — pigment-washed by domain (via the --pig channel), hairline edges */
  .seg {
    fill: var(--pig-wash);
    stroke: var(--hairline);
    stroke-width: 1;
    cursor: pointer;
    transition: fill 0.3s ease, opacity 0.3s ease;
    outline: none;
  }
  .seg:hover { fill: var(--pig-chip); }
  .seg.is-current { stroke: var(--pig); stroke-width: 1.5; }
  .seg.is-selected { fill: var(--pig-chip); stroke: var(--pig); stroke-width: 1.75; }
  .seg.dim { opacity: 0.5; }
  .seg.is-current.dim { opacity: 0.78; }
  .seg:focus-visible { stroke: var(--pig); stroke-width: 1.75; }

  /* Domain rim arcs + labels */
  .quad-arc { stroke: var(--pig); stroke-width: 2.5; stroke-linecap: round; }
  .quad-label {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: 19px;
    font-weight: 480;
    letter-spacing: 0.06em;
    dominant-baseline: middle;
    fill: var(--pig);
  }

  /* Hub — Algorithm Zero */
  .hub {
    fill: var(--depth-3);
    stroke: var(--hairline);
    stroke-width: 1.25;
    cursor: pointer;
    transition: stroke 0.3s ease;
    outline: none;
  }
  .hub:hover { stroke: var(--text-muted); }
  .hub.is-selected { stroke: var(--text-secondary); stroke-width: 1.75; }
  .hub:focus-visible { stroke: var(--text-secondary); stroke-width: 1.75; }
  .hub-label {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: 17px;
    font-weight: 560;
    letter-spacing: 0.02em;
    fill: var(--text-primary);
    pointer-events: none;
  }

  /* Segment labels */
  .label { font-family: var(--font-body); font-size: 10px; fill: var(--text-secondary); pointer-events: none; transition: opacity 0.3s ease; }
  .label.dim { opacity: 0.5; }

  /* Numerals — mono, pigment-coloured, in a hairline well */
  .num { pointer-events: none; }
  .num-dot { fill: var(--bg-elevated); stroke: var(--pig); stroke-width: 1.25; transition: fill 0.3s ease, stroke-width 0.3s ease; }
  .num-dot.is-current { stroke-width: 2.75; }
  .num-dot.is-selected { fill: var(--pig); }
  .num-text { font-family: var(--font-mono); font-size: 10.5px; font-weight: 500; fill: var(--pig); }
  .num--hub .num-dot { stroke: var(--text-muted); }
  .num--hub .num-text { fill: var(--text-secondary); }

  /* Coach panel */
  .pw-coach {
    align-self: center;
    background: var(--bg-elevated);
    border: 1px solid var(--hairline);
    border-left: 3px solid var(--text-muted);
    border-radius: 10px;
    padding: 1.1rem 1.25rem 1.25rem;
    transition: border-color 0.3s ease;
  }
  .pw-coach.has-pig { border-left-color: var(--pig-current); }
  .pw-coach.is-week { box-shadow: inset 2px 0 0 var(--pig-current); }
  .coach-kicker {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--pig-current);
    margin-bottom: 0.5rem;
  }
  .coach-name {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: 1.4rem;
    font-weight: 480;
    line-height: 1.12;
    color: var(--text-primary);
    margin-bottom: 0.55rem;
  }
  .coach-wisdom {
    font-family: var(--font-body);
    font-size: 0.98rem;
    line-height: 1.55;
    color: var(--text-secondary);
  }

  /* Controls */
  .pw-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.55rem;
    margin-top: 1.5rem;
    padding-top: 1.1rem;
    border-top: 1px solid var(--hairline);
  }
  .ctl-btn {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: var(--text-secondary);
    background: var(--bg-elevated);
    border: 1px solid var(--hairline);
    border-radius: 999px;
    padding: 0.42rem 0.85rem;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
  }
  .ctl-btn:hover { border-color: var(--text-secondary); color: var(--text-primary); }
  .ctl-play.is-on { border-color: var(--derived); color: var(--derived); background: var(--derived-wash); }
  .ctl-begin { border-color: var(--derived); color: var(--derived); }
  .ctl-begin:hover { background: var(--derived-wash); color: var(--derived); }
  .ctl-week {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: var(--derived);
    padding: 0.42rem 0.2rem 0.42rem 0;
    font-weight: 500;
  }
  .ctl-x {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.2rem 0.3rem;
    margin-left: -0.3rem;
  }
  .ctl-x:hover { color: var(--text-secondary); }
  .ctl-readout {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    letter-spacing: 0.03em;
    color: var(--text-muted);
  }

  .pw-caption {
    margin-top: 0.9rem;
    font-family: var(--font-body);
    font-style: italic;
    font-size: 0.92rem;
    color: var(--text-muted);
    max-width: 60ch;
  }

  /* One quiet entrance — slices bloom around the clock, then settle. */
  @media (prefers-reduced-motion: no-preference) {
    .seg {
      transform-box: fill-box;
      transform-origin: center;
      animation: pw-bloom 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) backwards;
      animation-delay: calc(var(--i) * 45ms);
    }
    @keyframes pw-bloom {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }
  }
</style>
