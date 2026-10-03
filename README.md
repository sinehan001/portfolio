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
| **v2** | branch `v2` | Interactive edition: neural-network hero canvas, typeable terminal, Ctrl+K command palette, cursor follower, magnetic buttons, circular theme transition, and a playable simulation in every project |

Vercel builds a preview URL for every branch, so `v1` stays viewable after `v2` is merged into `main`.

### v2 interactive pieces

- `components/NeuralCanvas.tsx`: canvas network that follows the cursor; click for a shockwave
- `components/Terminal.tsx`: commands like `help`, `projects`, `goto contact`, `sudo hire-me`
- `components/CommandPalette.tsx`: Ctrl/Cmd + K
- `components/demos/*`: simulated RAG pipeline, live API dashboard, RabbitMQ queue, rolling vs. big-bang migration (all sample data, clearly labelled)

All motion respects `prefers-reduced-motion`.
