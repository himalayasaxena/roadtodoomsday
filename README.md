# Road to Doomsday

Fan-made MCU watch roadmap for *Avengers: Doomsday*.

## App

Next.js site lives in [`web/`](./web).

```bash
cd web
npm install
npm run dev
```

## Deploy (Vercel)

**Live:** [https://doomsdayroadmap.com](https://doomsdayroadmap.com) (also [path-to-doomsday.vercel.app](https://path-to-doomsday.vercel.app))

GitHub repo is connected for auto-deploys. Project **Root Directory** is `web`.

Set `NEXT_PUBLIC_SITE_URL` in Vercel if the canonical host changes (defaults to `https://doomsdayroadmap.com`).

Manual CLI deploy:

```bash
cd web
npx vercel
npx vercel --prod
```
