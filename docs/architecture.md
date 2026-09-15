# Architecture — WiNet Lab

Status: Home layout and first supplied content batch implemented, pending user acceptance. Updated 2026-09-15.

## Boundaries

- `src/layouts/SiteLayout.astro`: document language, metadata, shared header/footer, global stylesheet, and skip link.
- `src/components/`: shared Brand, navigation, footer, section heading, and small decorative brand mark. Header owns its mobile-menu script. Brand reads the name from site.json for both header and footer. Pages do not import other pages.
- `src/pages/index.astro`: Home composition only.
- `src/pages/[section].astro`: generates four explicitly unfinished route shells from navigation data. Replace with independent pages as their tasks are approved.
- `src/data/site.json`: identity, description, navigation. `src/data/home.json`: hero copy, image metadata, the three supplied introduction paragraphs, and News empty-state text. Fixed interface labels remain in components.
- `src/lib/paths.ts`: shared base-path handling for internal page links and static image URLs. File URLs do not receive page-style trailing slashes.
- `public/images/winet-lab-wordcloud.png`: the user-supplied original Home image, 2154×1614; preserved without cropping or redrawing.
- `src/styles/global.css`: design tokens, layout, components, responsive rules. No external fonts or image services.
- `tests/` and `scripts/`: production-browser verification, screenshot capture, and a separate repository-base-path check.

Astro generates five static HTML pages. Only mobile navigation needs client JavaScript. No application server, database, remote CMS, or deployment workflow is configured.

## Visual decisions

The MARS Lab reference informed the five-page navigation. Following user review, Home now contains the visual introduction, group introduction, News, and footer; Events and Collaborators were removed from markup, content data, and styles. The reference is guidance, not a requirement to reproduce every section. Its page text and stylesheet structure were read; the live reference screenshot failed with ERR_CONNECTION_RESET. Pixel-level equivalence has not been verified or claimed.

This site uses a pure-white (#ffffff) page background, forest green accents, system sans-serif body text, and Georgia headings. The footer, News panel, and image container also use white. The supplied word cloud replaces the original network illustration; its original colors and proportions are preserved. The old NetworkArt component and caption were removed. The small navigation/footer mark remains a draft code graphic. No reference-site people, publications, partner logos, or photos were copied.

## Runtime

Exact versions are locked in package.json and package-lock.json. Portable Node.js v24.21.0 was downloaded from the official distribution and verified against its official SHA-256 manifest. It lives only in ignored .tools/. No global runtime or PowerShell execution-policy changes were made. A PowerShell helper was removed after script policy prevented its execution; the user launcher is a .cmd file.

Astro requirements were checked against [official setup documentation](https://docs.astro.build/en/install-and-setup/) and registry metadata on 2026-09-15. The current CLI is node_modules/astro/bin/astro.mjs. Astro 7 may automatically detach CLI previews in agent environments; automated tests use its preview() API with a foreground process.

## Deployment boundary

SITE_BASE defaults to /. A trial /winet-group/ build was independently exercised on localhost. This trial name does not confirm the user's repository. Verify actual owner and repository before applying the [GitHub Pages configuration](https://docs.astro.build/en/guides/deploy/github/).

Preview metadata includes noindex, nofollow; review and remove it before an approved public release. No remote is configured and no code has been uploaded. Local proof does not establish mainland-China or international production availability.
