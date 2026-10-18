// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Replace with your live domain before deploying (used for sitemap, RSS and social previews).
export default defineConfig({
  site: 'https://thespiritualdove.com',
  integrations: [sitemap()],
});
