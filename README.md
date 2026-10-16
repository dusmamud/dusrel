# Dusrel — dusrel.com

Company landing page for **Dusrel** — free, privacy-first apps. *"YOUR PRIVACY MATTERS."*

## Stack

- [Astro](https://astro.build) 7 (static site)
- [Tailwind CSS](https://tailwindcss.com) v4
- React 19 (islands) + TypeScript (strict)
- Self-hosted fonts (Sora + Inter), no external requests

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # static build -> dist/
```

## Structure

- `src/pages/index.astro` — English
- `src/pages/hi/index.astro` — Hindi
- `src/components/` — Hero, Ecosystem, WhyDusrel, Footer
- `src/i18n/` — en/hi dictionaries
- `src/layouts/Base.astro` — SEO head (meta, OG, hreflang, Organization JSON-LD) + sitemap

## License

All rights reserved © 2026 Dusrel.
