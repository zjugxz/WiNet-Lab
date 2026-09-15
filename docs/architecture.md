# Architecture — F01

Status: implemented for the Home prototype, pending user acceptance. Updated 2026-09-15.

## Boundaries

- `src/layouts/SiteLayout.astro`: document language, metadata, shared header/footer, global stylesheet, and skip link.
- `src/components/`: shared navigation, footer, section heading, and original decorative artwork. Header owns its mobile-menu script. Pages do not import other pages.
- `src/pages/index.astro`: Home composition only.
- `src/pages/[section].astro`: generates four explicitly unfinished route shells from navigation data. Replace with independent pages as their tasks are approved.
- `src/data/site.json`: identity, description, navigation. `src/data/home.json`: introductory copy and section empty states. Fixed interface labels remain in components.
- `src/lib/paths.ts`: shared base-path handling for every internal page link.
- `src/styles/global.css`: design tokens, layout, components, responsive rules. No external fonts or image services.
- `tests/` and `scripts/`: production-browser verification, screenshot capture, and a separate repository-base-path check.

Astro generates five static HTML pages. Only mobile navigation needs client JavaScript. No application server, database, remote CMS, or deployment workflow is configured.

## Visual decisions

The MARS Lab reference informed the five-page navigation. Following user review, Home now contains the visual introduction, group introduction, News, and footer; Events and Collaborators were removed from markup, content data, and styles. The reference is guidance, not a requirement to reproduce every section. Its page text and stylesheet structure were read; the live reference screenshot failed with ERR_CONNECTION_RESET. Pixel-level equivalence has not been verified or claimed.

This prototype uses a pure-white (#ffffff) page background, forest green accents, system sans-serif body text, and Georgia headings. The footer, News panel, and illustration container also use white; the illustration retains its own graphic colors. The network illustration and group mark are original code graphics, not approved branding or actual research imagery. No reference-site people, publications, partner logos, or photos were copied.

## Runtime

Exact versions are locked in package.json and package-lock.json. Portable Node.js v24.21.0 was downloaded from the official distribution and verified against its official SHA-256 manifest. It lives only in ignored .tools/. No global runtime or PowerShell execution-policy changes were made. A PowerShell helper was removed after script policy prevented its execution; the user launcher is a .cmd file.

Astro requirements were checked against [official setup documentation](https://docs.astro.build/en/install-and-setup/) and registry metadata on 2026-09-15. The current CLI is node_modules/astro/bin/astro.mjs. Astro 7 may automatically detach CLI previews in agent environments; automated tests use its preview() API with a foreground process.

## Deployment boundary

SITE_BASE defaults to /. A trial /winet-group/ build was independently exercised on localhost. This trial name does not confirm the user's repository. Verify actual owner and repository before applying the [GitHub Pages configuration](https://docs.astro.build/en/guides/deploy/github/).

Preview metadata includes noindex, nofollow; review and remove it before an approved public release. No remote is configured and no code has been uploaded. Local proof does not establish mainland-China or international production availability.
