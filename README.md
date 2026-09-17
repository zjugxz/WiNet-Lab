# WiNet Lab website

An English-language academic lab website, with a static Astro frontend and shared page components. Home includes the supplied WiNet Lab introduction, word-cloud image, and seven News records. Introductory and News body text supports paired **bold** markers in the content data. Research, Publications, People, and Contact are explicitly marked placeholders.

## Local preview on this computer

Double-click **start-preview.cmd**, keep its window open, and visit **http://127.0.0.1:4321/**. Press Ctrl+C in that window to stop it. A project-local Node.js runtime has been prepared in `.tools/`; it is not committed to Git.

## Setup on another computer

Install an active, even-numbered Node.js LTS release satisfying `>=22.12.0` from [nodejs.org](https://nodejs.org/). From the project directory:

```sh
npm ci
npm run dev
```

In Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`. No execution-policy changes are required.

## Validation

```sh
npm run check
npm run build
npx playwright install chromium
npm test
```

The browser tests create an isolated production preview on port 4322. With a preview running on port 4321, `node scripts/capture.mjs` updates the desktop and mobile review screenshots. On this computer, set `PLAYWRIGHT_BROWSERS_PATH` to the project's `.tools/browsers` directory to use the prepared browser; otherwise Playwright uses its standard cache.

## Content and handoff

See [docs/README.md](docs/README.md) for requirements, progress, architecture, content editing, and verification evidence. The form-based online CMS is a later milestone; editing JSON alone does not yet provide that workflow.

The user now intends to publish an initial preview to zjugxz/WiNet-Lab. The local GitHub Pages workflow and Astro site configuration are ready: pushes to main (or manual dispatch) check and build with Node 24 and SITE_BASE=/WiNet-Lab/, then deploy the static output. Local development still defaults to /. See [deployment instructions](docs/github-pages-preview.md) for Pages settings and first-push steps. The workflow has not run on GitHub; repository access/settings and the live site remain unverified. The online CMS is still a later milestone.
