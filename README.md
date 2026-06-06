# tomcassidy-site

Tom Cassidy's personal hub — a sibling to **Distinction Physics** and
**Configuration Economics**. Built with Astro 5 (`output: 'server'`,
`@astrojs/vercel`), inline-CSS-in-Astro, a shared design-token system, an
Astro **content collection** for prose essays, and a context-aware reading
**guide** (scaffold only — see the billing warning below).

This repository is currently **foundation/scaffold**. Several surfaces are
intentional placeholders (clearly marked `TODO` / `PLACEHOLDER`); content
migration and the guide's final persona + system prompt are separate later
jobs.

## ⚠️ The guide is billing-sensitive

`src/pages/api/guide.ts` calls the **Anthropic API**, which is **billed per
request**. It is wired but deliberately **not enabled**:

- No `ANTHROPIC_API_KEY` is committed. With no key the endpoint returns `503`
  and the panel shows a graceful "not enabled yet" message.
- `src/lib/guide-prompt.ts` ships a **placeholder persona** (`GUIDE_PERSONA_TODO`)
  and a placeholder Socratic prompt. **Do not wire a real key or live-test the
  guide** until the persona + system prompt are finalised.
- The endpoint is SSR-only (`prerender = false`) and only fetches Anthropic
  inside `POST`, so **no API call happens at build time**. The panel never
  auto-sends — a request only fires on explicit user action.

## Structure

```text
/
├── astro.config.mjs          # server output, Vercel adapter, git build-number injection
├── tsconfig.json             # strict + "@/*" -> "src/*"
├── .env.example              # ANTHROPIC_API_KEY (empty; do not commit a real key)
├── src/
│   ├── styles/tokens.css     # design system — dark+light tokens (single source of truth)
│   ├── lib/
│   │   ├── version.ts        # VERSION + injected BUILD number
│   │   ├── math.ts           # KaTeX server-side render for guide replies
│   │   ├── essay-context.ts  # reads the essays collection -> live text for the guide
│   │   └── guide-prompt.ts   # guide persona + epistemic contract (PLACEHOLDER persona)
│   ├── content/
│   │   ├── config.ts         # "essays" collection schema (glob loader)
│   │   └── essays/*.md        # placeholder essays (exercise the pipeline)
│   ├── layouts/
│   │   ├── BaseLayout.astro   # shell: tokens, fonts, theme toggle, header/footer
│   │   └── EssayLayout.astro  # renders an essay + mounts the guide panel
│   ├── components/
│   │   ├── SiteHeader.astro / SiteFooter.astro
│   │   ├── ThemeToggle.astro
│   │   ├── EssayCard.astro / ProjectCard.astro
│   │   └── GuidePanel.astro   # reading companion (no auto-send)
│   └── pages/
│       ├── index.astro            # homepage: hero + writing preview + projects
│       ├── about.astro            # placeholder bio
│       ├── writing/index.astro    # essay index (client-side topic/series filter)
│       ├── writing/[slug].astro   # prerendered essay route via EssayLayout
│       ├── projects/index.astro   # Configuration Economics + Distinction Physics
│       └── api/guide.ts           # guide endpoint (SSR-only, billed — see above)
```

## Content collection: `essays`

Markdown files in `src/content/essays/`, validated by `src/content/config.ts`:

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
`--accent` tokens, and the four epistemic-status colours
(`established` `#4a9eff`, `derived` `#50c878`, `contested` `#f97316`,
`open` `#a855f7` in dark; warmer equivalents in light). Fonts: Cormorant
Garamond (display) / Sora (body) / JetBrains Mono (mono).

## Commands

| Command           | Action                                  |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Local dev server                        |
| `npm run build`   | Production build to `./dist/`           |
| `npm run check`   | `astro check` (types)                   |
| `npm run preview` | Preview the build                       |
