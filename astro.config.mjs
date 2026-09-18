import { defineConfig } from 'astro/config';

// GitHub Actions supplies /WiNet-Lab/; local development stays at /.
export default defineConfig({
  site: 'https://zjugxz.github.io',
  output: 'static',
  base: process.env.SITE_BASE || '/',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: {
    server: {
      watch: {
        // Generated builds and private source media are not app inputs. Large
        // copies into these folders can trigger Windows EBUSY watcher errors.
        ignored: ['**/.tools/**', '**/resources/**'],
      },
    },
  },
});
