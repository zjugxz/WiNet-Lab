import { defineConfig } from 'astro/config';

// Set SITE_BASE to the actual repository path when preparing deployment.
// The remote account and repository have not been verified yet.
export default defineConfig({
  output: 'static',
  base: process.env.SITE_BASE || '/',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
