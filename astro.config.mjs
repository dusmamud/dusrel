import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://dusrel.com',
  integrations: [
    react(),
    sitemap({
      // Search-result pages are for visitors (and browsers' OpenSearch),
      // not for the index — keep them out of the sitemap.
      filter: (page) => !page.includes('/search/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
