import { preview } from 'astro';

// A foreground server owned by Playwright, separate from the user's preview.
const server = await preview({ server: { host: '127.0.0.1', port: 4322 } });
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    await server.stop();
    process.exit(0);
  });
}
