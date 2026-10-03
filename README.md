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
