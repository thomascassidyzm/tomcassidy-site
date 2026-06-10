<script lang="ts">
  /**
   * ProgramShowcase.svelte — one wheel, the whole family. A pill selector swaps
   * which Program drives a single ProgramWheel, so the "same engine, different
   * data" thesis is the interaction itself. Each tab carries the programme's
   * accent pigment. `{#key}` re-mounts the wheel per switch for a clean entrance.
   */
  import ProgramWheel from '@/kit/ProgramWheel.svelte';
  import type { Program, Pigment } from '@/kit/types';

  interface Props {
    programs: Program[];
    /** One accent pigment per programme, same order. */
    accents?: Pigment[];
  }
  let { programs, accents = ['derived', 'established', 'open', 'contested'] }: Props = $props();

  let active = $state(0);
  const accentFor = (i: number) => accents[i % accents.length];
</script>

<div class="showcase">
  <div class="tabs" role="tablist" aria-label="Choose a programme">
    {#each programs as p, i (p.slug)}
      <button
        class="tab"
        class:is-active={i === active}
        style={`--pig: var(--${accentFor(i)})`}
        role="tab"
        aria-selected={i === active}
        type="button"
        onclick={() => (active = i)}
      >
        {p.title}
      </button>
    {/each}
  </div>

  {#key active}
    <ProgramWheel program={programs[active]} />
  {/key}
</div>

<style>
  .showcase { margin: 1.5rem 0 0; }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }
  .tab {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: var(--text-secondary);
    background: var(--bg-elevated);
    border: 1px solid var(--hairline);
    border-radius: 999px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
  }
  .tab:hover { color: var(--text-primary); border-color: var(--pig); }
  .tab.is-active {
    color: var(--pig);
    border-color: var(--pig);
    background: color-mix(in srgb, var(--pig) 10%, var(--bg-elevated));
  }
</style>
