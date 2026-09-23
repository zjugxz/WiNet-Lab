# PI homepage link update (2026-09-23)

## Scope

- Replace the PI homepage target with `https://zjugxz.github.io/xiuzhen-guo-homepage/`.
- Cover the Home About link, the PI link button on People, and the Website button on the PI detail page.
- Keep Google Scholar, email, internal profile navigation, and all other links unchanged.

## Implementation

- `src/data/home.json` supplies the linked `Dr. Xiuzhen Guo` text on Home.
- `src/data/people.json` supplies the shared PI website target used on the People index and PI detail page.
- `scripts/check-people.mjs` asserts the new target in both People locations and under both supported base paths.

## Verification

- `astro check`: 59 files, zero errors, warnings, or hints.
- Root and `/WiNet-Lab/` production builds: 24 pages each.
- Full Playwright regression: 17 tests passed; Home asserts the linked PI name uses the new target.
- People checks passed at both bases for 18 cards and 18 detail pages; the PI card and detail-page Website button both use the new target.
- Repository base-path browser check passed with the new Home link and no failed requests.
- Source and generated-output scans found no exact teacher-homepage link remaining at `https://zjugxz.github.io` or `https://zjugxz.github.io/`.

User acceptance and remote publication remain pending.
