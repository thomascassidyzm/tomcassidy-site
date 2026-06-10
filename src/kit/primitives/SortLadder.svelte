<script lang="ts">
  /**
   * SortLadder.svelte — the 'scale' primitive: a ladder of tiers and a tray of
   * cards the learner drags (or taps) onto the right rung, with praise/nudge
   * feedback and a live aggregate meter. Entirely driven by a ScaleSpec — the
   * tiers, cards, scores and coaching copy are DATA, so any programme gets a
   * working sorter by authoring a spec. Generalises the "Did it grow into its
   * shape?" sorter that proved the interaction.
   *
   * Standard affordances: pointer drag + tap-to-place fallback, keyboard
   * operation, reset, aria-live feedback, one quiet entrance, every colour a
   * theme token through the --pig channel.
   */
  import type { ScaleSpec } from '../types';

  interface Props {
    spec: ScaleSpec;
  }
  let { spec }: Props = $props();

  const PRAISE = spec.praise ?? ['Right rung.', 'Exactly.', 'Spot on.', 'Yes — that belongs there.'];
  const NUDGE_UP = spec.nudgeUp ?? ['Nearer the top — this belongs higher.'];
  const NUDGE_DOWN = spec.nudgeDown ?? ['Lower down — this belongs further down.'];
  const trayLabel = spec.trayLabel ?? 'The tray — drag a card onto its rung';
  const INTRO = 'Pick up a card and drop it on the rung where it belongs.';
  const pick = (a: string[]) => a[Math.floor(Math.random() * a.length)];

  const cardOf = Object.fromEntries(spec.cards.map((c) => [c.id, c]));
  const scoreOf: Record<number, number> = Object.fromEntries(
    spec.tiers.map((t) => [t.n, t.score]),
  );

  // cardId -> tier number, or null while it sits in the tray.
  let placed = $state<Record<string, number | null>>(
    Object.fromEntries(spec.cards.map((c) => [c.id, null])),
  );
  // Tray display order — data order at first paint (SSR-stable); shuffled on reset.
  let trayOrder = $state<string[]>(spec.cards.map((c) => c.id));
  let selectedId = $state<string | null>(null);
  let msg = $state({ text: INTRO, kind: '' as '' | 'ok' | 'no' });
  let flash = $state<{ n: number; kind: 'ok' | 'no' } | null>(null);
  let nudged = $state<number | null>(null);
  let justPlaced = $state<string | null>(null);

  // Pointer drag — a component-rendered ghost, zones hit-tested under the pointer.
  let drag = $state<{ id: string; x: number; y: number; w: number } | null>(null);
  let overZone = $state<string | null>(null);
  let pointerMoved = false;

  const trayCards = $derived(trayOrder.filter((id) => placed[id] == null));
  const inTier = (n: number) => spec.cards.filter((c) => placed[c.id] === n).map((c) => c.id);

  const meter = $derived.by(() => {
    const down = spec.cards.filter((c) => placed[c.id] != null);
    if (!down.length) return null;
    const sum = down.reduce((s, c) => s + (scoreOf[placed[c.id]!] ?? 0), 0);
    return Math.round(sum / down.length);
  });

  function setMsg(text: string, kind: '' | 'ok' | 'no') {
    msg = { text, kind };
  }
  function clearSelection() {
    selectedId = null;
  }

  function moveCard(id: string, dest: string) {
    const card = cardOf[id];
    if (!card) return;
    const toTray = dest === 'tray';
    placed[id] = toTray ? null : Number(dest);
    if (toTray && !trayOrder.includes(id)) trayOrder = [...trayOrder, id];
    justPlaced = id;
    setTimeout(() => (justPlaced = null), 400);
    if (toTray) {
      setMsg('Back in the tray — try another rung.', '');
    } else {
      const n = Number(dest);
      if (n === card.tier) {
        flash = { n, kind: 'ok' };
        setMsg(pick(PRAISE), 'ok');
      } else {
        flash = { n, kind: 'no' };
        nudged = n;
        setTimeout(() => (nudged = null), 460);
        setMsg(pick(n > card.tier ? NUDGE_UP : NUDGE_DOWN), 'no');
      }
      setTimeout(() => (flash = null), 620);
    }
  }

  // — tap-to-place fallback —
  function onCardClick(id: string) {
    if (pointerMoved) {
      pointerMoved = false; // that "click" was the tail of a drag
      return;
    }
    if (selectedId === id) {
      clearSelection();
      setMsg('Cancelled.', '');
      return;
    }
    selectedId = id;
    setMsg('Now tap the rung where it belongs.', '');
  }
  function onZoneClick(dest: string) {
    if (!selectedId) return;
    const id = selectedId;
    clearSelection();
    moveCard(id, dest);
  }
  function onCardKey(e: KeyboardEvent, id: string) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCardClick(id);
    } else if (/^[0-9]$/.test(e.key)) {
      // keyboard placement: a digit drops the focused card straight on that rung
      // (0 returns it to the tray).
      const n = Number(e.key);
      if (n === 0) {
        e.preventDefault();
        moveCard(id, 'tray');
      } else if (spec.tiers.some((t) => t.n === n)) {
        e.preventDefault();
        clearSelection();
        moveCard(id, String(n));
      }
    }
  }

  // — pointer drag —
  function onPointerDown(e: PointerEvent, id: string) {
    if (e.button !== 0) return;
    const el = e.currentTarget as HTMLElement;
    const startX = e.clientX;
    const startY = e.clientY;
    const w = el.offsetWidth;
    pointerMoved = false;

    function onMove(ev: PointerEvent) {
      const x = ev.clientX;
      const y = ev.clientY;
      if (!pointerMoved && Math.hypot(x - startX, y - startY) > 5) {
        pointerMoved = true;
        clearSelection();
      }
      if (!pointerMoved) return;
      drag = { id, x, y, w };
      const under = document.elementFromPoint(x, y);
      const zone = under?.closest('[data-zone]') as HTMLElement | null;
      overZone = zone?.dataset.zone ?? null;
      ev.preventDefault();
    }
    function onUp() {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      if (pointerMoved && overZone != null) moveCard(id, overZone);
      drag = null;
      overZone = null;
    }
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
  }

  function reset() {
    clearSelection();
    for (const c of spec.cards) placed[c.id] = null;
    trayOrder = [...trayOrder].sort(() => Math.random() - 0.5);
    setMsg(INTRO, '');
  }
</script>

{#snippet card(id: string)}
  {@const c = cardOf[id]}
  {@const where = placed[id]}
  {@const correct = where != null && where === c.tier}
  {@const misplaced = where != null && where !== c.tier}
  <div
    class="ps-card"
    class:ps-placed={where != null}
    class:ps-correct={correct}
    class:ps-misplaced={misplaced}
    class:ps-selected={selectedId === id}
    class:ps-grabbing={drag?.id === id}
    class:ps-just-placed={justPlaced === id}
    role="listitem"
    aria-label={c.label}
    tabindex="0"
    onpointerdown={(e) => onPointerDown(e, id)}
    onclick={() => onCardClick(id)}
    onkeydown={(e) => onCardKey(e, id)}
  >
    <span class="ps-card-dot" aria-hidden="true"></span>
    <span class="ps-card-txt">{c.label}</span>
    <span class="ps-card-mark" aria-hidden="true">{correct ? '✓' : misplaced ? '·' : ''}</span>
  </div>
{/snippet}

<div class="ps">
  <div class="ps-head">
    <p class="ps-cue"><span class="ps-cue-arrow" aria-hidden="true">↑</span> {spec.cue}</p>
    <div class="ps-meter" role="group" aria-label={spec.meterLabel}>
      <div class="ps-meter-top">
        <span class="ps-meter-label">{spec.meterLabel}</span>
        <span
          class="ps-meter-val"
          class:val-good={meter != null && meter >= 66}
          class:val-poor={meter != null && meter < 40}
          >{meter == null ? '—' : `${meter}%`}</span
        >
      </div>
      <div class="ps-meter-track">
        <div class="ps-meter-fill" style={`width: ${meter ?? 0}%`}></div>
      </div>
    </div>
  </div>

  <ol class="ps-ladder">
    {#each spec.tiers as t, i (t.n)}
      <li
        class="ps-tier"
        class:ps-over={overZone === String(t.n)}
        class:ps-flash-ok={flash?.n === t.n && flash.kind === 'ok'}
        class:ps-flash-no={flash?.n === t.n && flash.kind === 'no'}
        class:ps-nudge={nudged === t.n}
        style={`--i:${i}; --pig: var(--${t.pigment}); --pig-wash: var(--${t.pigment}-wash)`}
        data-zone={t.n}
        onclick={(e) => {
          if ((e.target as HTMLElement).closest('.ps-card')) return;
          onZoneClick(String(t.n));
        }}
      >
        <span class="ps-tier-num" aria-hidden="true">{t.n}</span>
        <div class="ps-tier-head">
          <p class="ps-tier-title">{t.title}</p>
          <p class="ps-tier-sub">{t.sub}</p>
        </div>
        <div class="ps-slot" role="list" aria-label={`Tier ${t.n}: ${t.title}`}>
          {#if inTier(t.n).length === 0}
            <span class="ps-slot-hint" aria-hidden="true">drop here</span>
          {/if}
          {#each inTier(t.n) as id (id)}
            {@render card(id)}
          {/each}
        </div>
      </li>
    {/each}
  </ol>

  <div class="ps-tray-wrap">
    <p class="ps-tray-label"><span>{trayLabel}</span><span class="ps-rule" aria-hidden="true"></span></p>
    <div
      class="ps-tray"
      class:ps-over={overZone === 'tray'}
      data-zone="tray"
      role="list"
      aria-label="Unsorted cards"
      onclick={(e) => {
        if ((e.target as HTMLElement).closest('.ps-card')) return;
        onZoneClick('tray');
      }}
    >
      {#if trayCards.length === 0}
        <span class="ps-tray-done" aria-hidden="true">All sorted.</span>
      {/if}
      {#each trayCards as id (id)}
        {@render card(id)}
      {/each}
    </div>
  </div>

  <div class="ps-foot">
    <p class="ps-msg" class:ps-msg-ok={msg.kind === 'ok'} class:ps-msg-no={msg.kind === 'no'} aria-live="polite">
      {msg.text}
    </p>
    <button type="button" class="ps-reset" onclick={reset}>Reset</button>
  </div>

  {#if drag}
    <div class="ps-card ps-drag-ghost" style={`left:${drag.x}px; top:${drag.y}px; width:${drag.w}px`}>
      <span class="ps-card-dot" aria-hidden="true"></span>
      <span class="ps-card-txt">{cardOf[drag.id].label}</span>
    </div>
  {/if}
</div>

<style>
  .ps {
    font-family: var(--font-body);
    color: var(--text-primary);
    width: min(960px, 94vw);
    margin: 3rem 0;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    box-sizing: border-box;
  }
  .ps :global(*) {
    box-sizing: border-box;
  }

  .ps-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.4rem;
  }
  .ps-cue {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0;
  }
  .ps-cue-arrow { color: var(--derived); font-size: 0.95rem; line-height: 1; }

  /* live read-out */
  .ps-meter { min-width: 230px; flex: 0 1 auto; }
  .ps-meter-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.6rem;
    margin-bottom: 0.4rem;
  }
  .ps-meter-label {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--text-muted);
  }
  .ps-meter-val {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-weight: 500;
    font-size: 1.15rem;
    color: var(--text-secondary);
    font-variant-numeric: tabular-nums;
    transition: color 0.5s ease;
  }
  .ps-meter-val.val-good { color: var(--derived); }
  .ps-meter-val.val-poor { color: var(--contested); }
  .ps-meter-track {
    height: 7px;
    border-radius: 99px;
    background: var(--depth-2);
    border: 1px solid var(--hairline);
    overflow: hidden;
    position: relative;
  }
  .ps-meter-fill {
    height: 100%;
    border-radius: 99px;
    background: linear-gradient(90deg, var(--contested-chip), var(--derived-chip));
    transition: width 0.55s cubic-bezier(0.22, 0.61, 0.36, 1);
  }

  /* the ladder — each tier takes its pigment from data via the --pig channel */
  .ps-ladder { display: flex; flex-direction: column; gap: 0.6rem; list-style: none; padding: 0; margin: 0; }
  .ps-tier {
    display: grid;
    grid-template-columns: 2.6rem 1fr;
    gap: 0 1rem;
    align-items: stretch;
    padding: 0.8rem 0.95rem;
    border: 1px solid var(--hairline);
    border-left: 3px solid var(--pig);
    border-radius: 9px;
    background: linear-gradient(90deg, var(--pig-wash), transparent 52%), var(--bg-elevated);
    transition: box-shadow 0.35s ease, border-color 0.35s ease, background 0.45s ease, transform 0.2s ease;
  }

  .ps-tier-num {
    grid-row: 1 / 3;
    align-self: start;
    width: 1.9rem;
    height: 1.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 0.92rem;
    border-radius: 50%;
    background: var(--bg-elevated);
    border: 1.25px solid var(--pig);
    color: var(--pig);
  }

  .ps-tier-head { grid-column: 2; }
  .ps-tier-title {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-weight: 500;
    font-size: 1.02rem;
    line-height: 1.25;
    color: var(--text-primary);
    margin: 0;
  }
  .ps-tier-sub {
    font-family: var(--font-mono);
    font-size: 0.64rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin: 0.2rem 0 0;
  }

  /* drop slot — where placed cards live */
  .ps-slot {
    grid-column: 2;
    margin-top: 0.6rem;
    min-height: 2.65rem;
    border: 1px dashed var(--hairline);
    border-radius: 7px;
    padding: 0.32rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    align-content: flex-start;
    transition: border-color 0.25s ease, background 0.25s ease;
  }
  .ps-slot-hint {
    font-family: var(--font-mono);
    font-size: 0.64rem;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    opacity: 0.65;
    align-self: center;
    padding-left: 0.3rem;
    pointer-events: none;
  }

  .ps-tier.ps-over {
    border-color: var(--text-secondary);
    box-shadow: 0 0 0 2px var(--depth-3);
  }
  .ps-tier.ps-over .ps-slot { border-color: var(--text-secondary); background: var(--surface); }

  .ps-tier.ps-flash-ok { box-shadow: 0 0 0 2px var(--derived-chip); }
  .ps-tier.ps-flash-no { box-shadow: 0 0 0 2px var(--contested-chip); }

  /* the tray of unsorted cards */
  .ps-tray-wrap { margin-top: 1.5rem; }
  .ps-tray-label {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin: 0 0 0.6rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .ps-tray-label .ps-rule { flex: 1; height: 1px; background: var(--hairline); }
  .ps-tray {
    min-height: 3.3rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.55rem;
    border: 1px solid var(--hairline);
    border-radius: 9px;
    background: var(--depth-1);
    transition: border-color 0.25s ease, background 0.25s ease;
  }
  .ps-tray.ps-over { border-color: var(--text-secondary); background: var(--surface); }
  .ps-tray-done {
    font-family: var(--font-body);
    font-style: italic;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: auto;
  }

  /* cards */
  .ps-card {
    position: relative;
    font-family: var(--font-body);
    font-size: 0.92rem;
    color: var(--text-primary);
    background: var(--surface);
    border: 1px solid var(--hairline);
    border-radius: 99px;
    padding: 0.36rem 0.85rem 0.36rem 0.78rem;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.16s ease, background 0.3s ease;
    touch-action: none;
  }
  .ps-card:hover { border-color: var(--text-muted); transform: translateY(-1px); }
  .ps-card:focus-visible { outline: 2px solid var(--established); outline-offset: 2px; }
  .ps-card.ps-grabbing { cursor: grabbing; opacity: 0.4; }
  .ps-card.ps-selected {
    border-color: var(--established);
    box-shadow: 0 0 0 2px var(--established-wash);
  }
  .ps-card-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--text-muted);
    flex: none;
    transition: background 0.3s ease;
  }
  .ps-card.ps-placed { padding-left: 0.85rem; }
  .ps-card.ps-correct { border-color: var(--derived); background: linear-gradient(0deg, var(--derived-wash), var(--surface)); }
  .ps-card.ps-correct .ps-card-dot { background: var(--derived); }
  .ps-card.ps-misplaced { border-color: var(--contested); background: linear-gradient(0deg, var(--contested-wash), var(--surface)); }
  .ps-card.ps-misplaced .ps-card-dot { background: var(--contested); }
  .ps-card-mark {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1;
    font-weight: 600;
  }
  .ps-card.ps-correct .ps-card-mark { color: var(--derived); }
  .ps-card.ps-misplaced .ps-card-mark { color: var(--contested); }

  /* the floating ghost while dragging */
  .ps-drag-ghost {
    position: fixed;
    z-index: 40;
    pointer-events: none;
    box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.45);
    transform: translate(-50%, -50%) scale(1.04);
    opacity: 0.97;
  }

  /* footer line: nudge messages + reset */
  .ps-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1.2rem;
    min-height: 1.6rem;
  }
  .ps-msg {
    font-family: var(--font-body);
    font-style: italic;
    font-size: 0.93rem;
    color: var(--text-secondary);
    margin: 0;
    transition: opacity 0.3s ease, color 0.3s ease;
  }
  .ps-msg.ps-msg-ok { color: var(--derived); font-style: normal; }
  .ps-msg.ps-msg-no { color: var(--contested); }
  .ps-reset {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--text-muted);
    background: none;
    border: 1px solid var(--hairline);
    border-radius: 99px;
    padding: 0.32rem 0.85rem;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;
    flex: none;
  }
  .ps-reset:hover { color: var(--text-primary); border-color: var(--text-muted); }

  @media (prefers-reduced-motion: no-preference) {
    .ps-head { animation: ps-rise 0.5s ease both; }
    .ps-tier { animation: ps-rise 0.55s ease both; animation-delay: calc(var(--i) * 80ms + 90ms); }
    .ps-tray-wrap { animation: ps-rise 0.55s ease both; animation-delay: 0.46s; }
    .ps-card.ps-just-placed { animation: ps-pop 0.34s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .ps-tier.ps-nudge { animation: ps-shake 0.4s ease both; }
    @keyframes ps-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    @keyframes ps-pop { 0% { transform: scale(0.7); } 60% { transform: scale(1.08); } 100% { transform: scale(1); } }
    @keyframes ps-shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
  }

  @media (max-width: 560px) {
    .ps-tier { grid-template-columns: 2.1rem 1fr; padding: 0.7rem 0.7rem; }
    .ps-meter { min-width: 100%; }
  }
</style>
