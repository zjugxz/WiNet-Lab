# WiNet Lab website

An academic lab website with an English interface, a static Astro frontend, and shared page components. Website: [zjugxz.github.io/WiNet-Lab](https://zjugxz.github.io/WiNet-Lab/).

- Home: supplied lab introduction, word-cloud image, and seven News records; body text supports paired **bold** markers.
- Research: three directions and six paper cards, five looping video previews, one image, three open papers, and five full-demo downloads. Cards with a Demo appear first. Unavailable papers show `Paper coming soon`; unpublished PDFs are excluded from the site. Published venue/year labels use a warm brown serif style; submission venue/year fields remain unfilled.
- Publications: 74 records (original item 71 removed), year/type filters, keyword search, and 73 publication links. Original Chinese titles are retained.
- Contact: collaboration and PhD/Master recruitment information, with the supplied public email.
- People and the third Research direction: explicit placeholders. The online content-management backend is not implemented.

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

`node scripts/capture-publications.mjs` captures Publications desktop/mobile views and a filtered book result using its own temporary preview on port 4324. Publication data lives in `src/data/publications.json`; see [content maintenance](docs/content-maintenance.md) for all data fields. Internal bibliography-audit flags are not rendered as pending labels.

For deployment checks, build a second output with `SITE_BASE=/WiNet-Lab/` into `.tools/base-dist`, then run `node scripts/check-base.mjs` and `node scripts/check-research-downloads.mjs`. The latter checks both builds, including withheld PDF URLs returning 404, Demo-first ordering, venue styles, and exact download bytes. `node scripts/check-research-card.mjs` separately checks media playback, accessibility, and responsive cards using isolated fixtures.

## Content and handoff

The latest local Research addition provides a Cite dialog with Text/BibTeX/RIS view, copy and download for the three published papers, plus publisher links. Citation sources live in `src/data/citations/`, with optional `citationId` references in research.json; submitted papers have no Cite entry. Run `node scripts/check-research-citations.mjs` against root/base builds. See [citation sources and verification](docs/verification/research-cite-2026-09-18.md). This addition has not yet been published.

See [docs/README.md](docs/README.md) for requirements, progress, architecture, content editing, and verification evidence. The form-based online CMS is a later milestone; editing JSON alone does not yet provide that workflow.

The user authorized publishing the current website on 2026-09-18. Pushes to main (or manual dispatch) check and build with Node 24 and SITE_BASE=/WiNet-Lab/, then deploy the static output. Local development defaults to /. See [deployment instructions and release status](docs/github-pages-preview.md).

`resources/` contains private source material and is Git-ignored. Only reviewed copies belong in `public/`. The local archive branch `codex/local-history-2026-09-18` preserves earlier development history containing withdrawn manuscripts; never push that branch or use `git push --all`/`--mirror`. Published main uses the existing remote history plus a clean snapshot of current files, so the withdrawn PDFs are not reachable from the published history. Keep publication permission separate from whether a file exists locally.
