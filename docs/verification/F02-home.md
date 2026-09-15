# F02 — WiNet Lab Home content integration

Date: 2026-09-15. First content batch implemented; user acceptance pending. Other pages and the online editor are not completed by this milestone.

## Content provenance and scope

The user supplied the three English paragraphs beginning “Welcome to the Wireless Intelligence…” and instructed their inclusion in Home. They are stored verbatim, in order, in `src/data/home.json` as `about.paragraphs`. The user also supplied the Home word cloud and specified the canonical name **WiNet Lab**.

The image initially had no accessible file path in the conversation tools. It was subsequently found at `public/images/winet-lab-wordcloud.png` and visually matched to the supplied image. The original PNG is 2154×1614, 1,854,233 bytes. It replaces the original generated network visual and its caption, without cropping or redrawing. HTML dimensions reserve its aspect ratio and descriptive alt text supports nonvisual access.

Header/footer branding now uses one Brand component and the same site.name value. Titles, metadata, the placeholder inner-page label, and the local launcher have been updated. Historical Git commits and example repository paths retain their original names; no remote repository was renamed.

## Verification

- Type checking: no errors, warnings, or hints.
- Static build: all five routes generated.
- Six production Chromium tests: passed, including three introduction paragraphs, WiNet Lab naming, loaded image with expected dimensions, navigation, keyboard use, and accessibility checks.
- Responsive layouts: 320, 390, 768, and 1440 px without horizontal overflow. Desktop and mobile screenshots visually checked for complete paragraph flow and uncropped image display.
- Repository base-path check: `/winet-group/` links, page titles, CSS, word-cloud URL/loading, and mobile menu checked by `scripts/check-base.mjs` after a separate build.
- Source search: no old Winet Group display name, obsolete introduction fields, or NetworkArt references remain in application code.

Current review images: [desktop](home-desktop.png), [mobile](home-mobile.png). Run the commands documented in [F01](F01.md) to reproduce the checks; `node scripts/capture.mjs` refreshes screenshots against the localhost preview.

No deployment, remote edits, online editor, physical-device test, or Safari/Firefox validation occurred. News and the four inner pages still contain explicit placeholders. Review this Home batch with the user before proceeding to another content batch.
