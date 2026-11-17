# André Luís — andretl.com

Personal website of André Luís, live at **[andretl.com](https://andretl.com)**.

Built with [Next.js](https://nextjs.org/) (static export), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) and [Tailwind CSS](https://tailwindcss.com/). Hosted on [Cloudflare](https://www.cloudflare.com/).

Originally forked from [mldangelo/personal-site](https://github.com/mldangelo/personal-site) (MIT, see [LICENSE](./LICENSE)).

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build, static export to ./out
npm run format       # Format code (run before committing)
npm run lint         # Lint
npm run type-check   # TypeScript check
npm test             # Run tests
```

## Deploying (Cloudflare)

The site is a static export, so Cloudflare only needs to serve the `out/` folder.

| Setting                | Value           |
| ---------------------- | --------------- |
| Build command          | `npm run build` |
| Build output directory | `out`           |
| Node.js version        | `20`            |

Optional build variable: `NEXT_PUBLIC_GA_TRACKING_ID` (Google Analytics measurement ID).

## Making changes

1. Create a branch from `main`.
2. Make your changes and run `npm run format`, `npm run lint`, `npm run type-check` and `npm test`.
3. Open a pull request. Merging to `main` deploys the site.
