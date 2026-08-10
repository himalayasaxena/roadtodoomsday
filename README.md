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

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **himalayasaxena/roadtodoomsday**
3. Set **Root Directory** to `web`
4. Deploy (no env vars required for the public site)

Or from the CLI:

```bash
cd web
npx vercel
npx vercel --prod
```
