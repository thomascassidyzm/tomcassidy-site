# tomcassidy-site

Tom Cassidy's personal hub — a sibling to **Distinction Physics** and
**Configuration Economics**. Built with Astro 5 (`output: 'server'`,
`@astrojs/vercel`), inline-CSS-in-Astro, a shared design-token system, an
Astro **content collection** for prose essays, a typed **programme** system
(the Reason-Ability kit), and a context-aware reading **guide** (wired but not
enabled — see the billing warning below).

The prose and programme surfaces now carry **real content**: 21 essays in the
collection and eight programmes in `src/lib/programs/`. A few surfaces are
still intentional placeholders (clearly marked `TODO` / `PLACEHOLDER`) —
`src/pages/about.astro` most obviously.

## ⚠️ The guide is billing-sensitive

`src/pages/api/guide.ts` calls the **Anthropic API**, which is **billed per
request**. It is wired but deliberately **not enabled**:

- No `ANTHROPIC_API_KEY` is committed. With no key the endpoint returns `503`
  and the panel shows a graceful "not enabled yet" message.
- `src/lib/guide-prompt.ts` now ships the **real persona**: Alexander, the
  shared epistemic guide across all of Tom's sites, plus the Socratic epistemic
  contract and Tom's canonical coaching voice imported verbatim from
  `src/lib/the-script.md` (`?raw`). **Verify with `npm run build` / `npm run
  check` only — do not wire a real key or live-test the guide**, because every
  request is billed.
- The endpoint is SSR-only (`prerender = false`) and only fetches Anthropic
  inside `POST`, so **no API call happens at build time**. The panel never
  auto-sends — a request only fires on explicit user action.

## Structure

```text
/
├── astro.config.mjs          # server output, Vercel adapter, Svelte, git build-number injection
├── vercel.json               # cron schedule for the pocket coach
├── tsconfig.json             # strict + "@/*" -> "src/*"
├── .env.example              # ANTHROPIC_API_KEY, VAPID push keys, CRON_SECRET (all empty)
├── src/
│   ├── styles/tokens.css     # design system — dark+light tokens (single source of truth)
│   ├── content.config.ts     # "essays" collection schema (glob loader)
│   ├── content/essays/*.md   # 21 essays — the real corpus
│   ├── lib/
│   │   ├── version.ts        # VERSION + injected BUILD number
│   │   ├── math.ts           # KaTeX server-side render for guide replies
│   │   ├── essay-context.ts  # reads the essays collection -> live text for the guide
│   │   ├── guide-prompt.ts   # Alexander's persona + epistemic contract + the Script
│   │   ├── the-script.md     # canonical coaching voice/method (imported ?raw)
│   │   ├── coach-engine.ts / today.ts / push-store.ts   # pocket coach
│   │   └── programs/*.ts     # eight programme data objects + the registry
│   ├── kit/                  # the Reason-Ability kit (future @reasonable/kit) — see src/kit/README.md
│   ├── layouts/
│   │   ├── BaseLayout.astro   # shell: tokens, fonts, theme toggle, header/footer
│   │   └── EssayLayout.astro  # renders an essay + mounts the guide panel
│   ├── components/
│   │   ├── SiteHeader.astro / SiteFooter.astro
│   │   ├── ThemeToggle.astro
│   │   ├── EssayCard.astro / ProjectCard.astro
│   │   ├── diagrams/          # programme figures (Astro) + ProgramShowcase (Svelte)
│   │   └── GuidePanel.astro   # reading companion (no auto-send)
│   └── pages/
│       ├── index.astro            # homepage: hero + writing preview + projects
│       ├── about.astro            # placeholder bio
│       ├── writing/index.astro    # essay index (client-side topic/series filter)
│       ├── writing/[slug].astro   # prerendered essay route via EssayLayout
│       ├── projects/index.astro   # Configuration Economics + Distinction Physics
│       ├── programmes.astro       # the programme family; one page each (/reasonable-eating, …)
│       ├── explore/[slug].astro   # STUDY mode — one deep page per programme, from the registry
│       ├── api/guide.ts           # guide endpoint (SSR-only, billed — see above)
│       └── api/push/*, api/cron/coach.ts   # pocket-coach subscribe + scheduled send
```

## Content collection: `essays`

Markdown files in `src/content/essays/`, validated by `src/content.config.ts`:

| field            | type                                                   | notes                          |
| ---------------- | ------------------------------------------------------ | ------------------------------ |
| `title`          | string                                                 | required                       |
| `slug`           | string                                                 | authored; stable URL           |
| `summary`        | string                                                 | required                       |
| `date`           | date (coerced)                                         | required                       |
| `topics`         | string[]                                               | default `[]`                   |
| `epistemicStatus`| `established` \| `derived` \| `contested` \| `open`    | optional                       |
| `draft`          | boolean                                                | default `false` (hidden if true) |
| `featured`       | boolean                                                | default `false`                |
| `series`         | string                                                 | optional                       |

The guide reads the **live** markdown of the essay on screen (via
`essay-context.ts` → `getCollection('essays')`), so editing a `.md` file
updates the guide's context with no prompt curation.

## Design system

`src/styles/tokens.css` is the single source of truth: dark (default) + light
themes via `[data-theme]`, the shared `--void` / `--depth-*` / `--text-*` /
`--accent` tokens, and the four epistemic pigments (`established` ink-blue
`#5b9fd6`, `derived` forest green `#57b481`, `contested` burnt amber `#e08545`,
`open` plum `#a981c9` in dark; deeper equivalents in light). The register is a
design-science journal — warm printed paper. Fonts: Fraunces (display) /
Newsreader (body) / IBM Plex Mono (mono).

## Commands

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Local dev server                        |
| `npm run build`   | Production build to `./dist/`           |
| `npm run check`   | `astro check` (types)                   |
| `npm run preview` | Preview the build                       |
