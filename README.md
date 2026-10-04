# Sinehan – Portfolio

Next.js (App Router) + TypeScript + Tailwind CSS v4 + Framer Motion. Fully static, no backend.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build & check

```bash
npm run lint
npx tsc --noEmit
npm run build
npm start        # serve the production build
```

## Editing content

All text, links, skills, experience and projects live in [`lib/content.ts`](lib/content.ts).
Sections are in `components/`, one file each.

- **Resume:** drop your file at `public/resume.pdf` (the "Download Resume" button links to it).
- **Site URL:** set `NEXT_PUBLIC_SITE_URL` in Vercel (e.g. `https://yourname.vercel.app`) so the canonical URL, sitemap, robots and Open Graph tags are correct. The default is in `lib/content.ts`.
- **Accent colour / theme:** CSS variables at the top of `app/globals.css`.
- **OG image:** generated at build time from `app/opengraph-image.tsx`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo (framework preset: Next.js, no config needed).
3. Add the env var `NEXT_PUBLIC_SITE_URL` with your final URL, then deploy.

Or with the CLI:

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

## Versions

| Version | Where | Notes |
| --- | --- | --- |
| **v1** | tag `v1.0.0`, branch `v1` | Clean static portfolio, Lighthouse 100 across the board |
| **v2** | tag `v2.0.0`, branch `v2` | Interactive edition: neural-network hero canvas, typeable terminal, Ctrl+K command palette, cursor follower, magnetic buttons, circular theme transition, and a playable simulation in every project |
| **v3 · Doomsday** | tag `v3.0.0`, branch `doomsday` | Iron & emerald theme (Parchment light mode), Cinzel display type, original SVG iron mask with cursor-tracking eyes, rotating gold sigil, rising embers, lightning on click, Iron Console, hold-to-summon contact |
| **v4 · Iron / Doom** | branch `v4` | Light mode is Iron (full Iron Man mask, HUD rings, blue arc particles, repulsor beams, Rajdhani type); dark mode is Doom (full Doom mask, sigil, embers, lightning, Cinzel). Iron is the default; the split-mask toggle flips between them |

Vercel builds a preview URL for every branch, so `v1` stays viewable after `v2` is merged into `main`.

### v2 interactive pieces

- `components/NeuralCanvas.tsx`: canvas network that follows the cursor; click for a shockwave
- `components/Terminal.tsx`: commands like `help`, `projects`, `goto contact`, `sudo hire-me`
- `components/CommandPalette.tsx`: Ctrl/Cmd + K
- `components/demos/*`: simulated RAG pipeline, live API dashboard, RabbitMQ queue, rolling vs. big-bang migration (all sample data, clearly labelled)

All motion respects `prefers-reduced-motion`.

### v3 Doomsday pieces

- `components/doom/IronMask.tsx`: original SVG mask; eyes follow the cursor, click to fire lightning
- `components/doom/LightningLayer.tsx`: full-screen lightning renderer (`strike()` in `lib/doom.ts`)
- `components/doom/EmberField.tsx`: rising embers; click empty hero space to call lightning
- `components/doom/Sigil.tsx`, `Ornament.tsx`, `MaskGlyph.tsx`: decorative SVG art
- `components/doom/SummonButton.tsx`: press-and-hold to email
- Lore copy lives in `doom` inside `lib/content.ts`

Hero mask: set `doom.mask` in `lib/content.ts` to `"combo"` (the supplied line-art SVG in `lib/maskCombo.ts`, rendered by `components/doom/ComboMask.tsx`) or `"original"` (the hand-drawn `IronMask.tsx`). The combo art is third-party; make sure its licence allows display on a public website.

### v4 dual theme

- Light = **Iron**, dark = **Doom**; Iron is the default and the choice is remembered (`localStorage.theme`)
- `components/doom/DualMask.tsx`: mirrors each half of the line art into a full face; faces flip on theme change
- `components/doom/HudRings.tsx`: Iron backdrop; `Sigil.tsx` is the Doom backdrop
- `components/doom/PowerCore.tsx`: Skills centrepiece. Iron: hexagonal nano-tech arc reactor; Doom: brilliant-cut emerald. Six plates/facets = six skill groups (synced with the filter tabs); the core shows all and overcharges
- Themed copy lives in `stark` and `doom` in `lib/content.ts`; markup shows one or the other with `.stark-only` / `.doom-only`
- Theme colours, particle/beam colours and the display font are CSS variables at the top of `app/globals.css`
