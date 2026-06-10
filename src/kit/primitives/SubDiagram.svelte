<script lang="ts">
  /**
   * SubDiagram.svelte — the dispatcher that makes sub-diagrams DATA. A focus
   * point carries `diagram: PrimitiveRef`; the page hands it here and the right
   * standard primitive renders — no per-diagram imports on any page, so a new
   * programme gets working instruments by authoring data alone.
   *
   * `preset` is the escape hatch: a bespoke component registered by name below
   * (for the rare kinetic idea no standard primitive can carry). The registry
   * is deliberately in ONE place so bespoke art stays accountable.
   *
   * The standard context strip above every instrument (programme · week ·
   * domain, pigment-tinted) comes from page context, never hand-authored.
   */
  import type { Component } from 'svelte';
  import type { PrimitiveRef, Pigment } from '../types';
  import SortLadder from './SortLadder.svelte';
  import PlotQuadrant from './PlotQuadrant.svelte';
  import ZoneSlider from './ZoneSlider.svelte';

  interface Context {
    programTitle?: string;
    week?: number;
    domain?: string;
    pigment?: Pigment;
  }
  interface Props {
    diagram: PrimitiveRef;
    context?: Context;
  }
  let { diagram, context }: Props = $props();

  // Bespoke escape-hatch components, by PresetRef.name. Empty today — and the
  // goal is that it stays small.
  const PRESETS: Record<string, Component<{ context?: Context }>> = {};

  const kicker = $derived(diagram.kind === 'slider' ? diagram.kicker : null);
  const contextLine = $derived(
    context
      ? [
          context.programTitle,
          context.week != null ? `wk ${String(context.week).padStart(2, '0')}` : null,
          context.domain?.toLowerCase(),
        ]
          .filter(Boolean)
          .join(' · ')
      : null,
  );
  const Preset = $derived(diagram.kind === 'preset' ? (PRESETS[diagram.name] ?? null) : null);
</script>

<figure class="subdiagram">
  {#if kicker || contextLine}
    <div class="sd-head" style={`--pig: var(--${context?.pigment ?? 'text-muted'})`}>
      {#if kicker}<span class="sd-kicker">{kicker}</span>{/if}
      {#if contextLine}<span class="sd-context">{contextLine}</span>{/if}
    </div>
  {/if}

  {#if diagram.kind === 'scale'}
    <SortLadder spec={diagram} />
  {:else if diagram.kind === 'quadrant'}
    <PlotQuadrant spec={diagram} />
  {:else if diagram.kind === 'slider'}
    <ZoneSlider spec={diagram} />
  {:else if diagram.kind === 'preset'}
    {#if Preset}
      <Preset {context} />
    {:else}
      <p class="sd-missing">Unknown preset diagram: “{diagram.name}”.</p>
    {/if}
  {/if}
</figure>

<style>
  .subdiagram {
    margin: 0;
  }

  /* the standard context strip — same language as the wheel's readout */
  .sd-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    width: min(1000px, 95vw);
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin: 2rem 0 -1.6rem;
  }
  .sd-kicker {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--pig);
    display: inline-flex;
    align-items: center;
    gap: 0.55em;
  }
  .sd-kicker::before {
    content: '';
    width: 1.6em;
    height: 1px;
    background: var(--pig);
    display: inline-block;
  }
  .sd-context {
    font-family: var(--font-mono);
    font-size: 10.5px;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-left: auto;
  }

  .sd-missing {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--contested);
    border: 1px dashed var(--contested);
    border-radius: 6px;
    padding: 0.6rem 0.9rem;
  }
</style>
