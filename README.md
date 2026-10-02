# Toon Transfer (GB Transfer)

Fast and secure file-sharing web app: upload a file, optionally protect it with a password and set an expiry time, then share a generated download link. Recipients download via the link — no account needed for the downloader. Authenticated users get a dashboard of their shared links.

## Features

- **File uploads** via drag-and-drop upload zone (Supabase Storage backend)
- **Shareable download links** — one link per file, e.g. `/download/<link-id>`
- **Password protection** — optional password on shared links
- **Link expiry** — links auto-expire after a configurable time
- **User auth** — sign up / sign in (Supabase Auth), personal dashboard of your links
- **About + 404 pages**, dark-mode-ready shadcn/ui design
- Fully client-side SPA — no server to run

## Tech Stack

- React 18 + TypeScript
- Vite (build) + React Router
- Tailwind CSS + shadcn/ui (Radix primitives)
- Supabase (Postgres, Auth, Storage) via `@supabase/supabase-js`
- TanStack Query, react-hook-form, lucide-react

## Quick Start

```bash
git clone https://github.com/girishlade111/toon-transfer.git
cd toon-transfer
npm install --legacy-peer-deps
```

Copy the Supabase config (a `.env` with `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` is expected at project root) and run:

```bash
npm run dev      # local dev server
npm run build    # production build -> dist/
```

## Project Structure

```
├── src/
│   ├── pages/        # Index, Download, Dashboard, Auth, About, NotFound
│   ├── components/   # UploadZone, LinkDisplay, FileSettings, ui/*
│   ├── hooks/        # useAuth, ...
│   └── integrations/supabase/  # client + generated types
├── supabase/         # migrations / config
├── public/           # static assets
├── vite.config.ts
└── package.json
```

## Deploy

Static SPA (client-side Supabase calls only, no server). Any static host works.
Currently deployed on GitHub Pages: https://girishlade111.github.io/toon-transfer/

The Vite `base` is set to `/toon-transfer/` and the router `basename` matches,
so relative project-site hosting works out of the box.

## License

MIT.

---

Built by Girish Lade — https://ladestack.in
