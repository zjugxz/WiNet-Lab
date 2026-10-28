# P76 accepted paper update (2026-10-28)

## Scope

The user supplied the IEEE BibTeX record for a newly accepted article and requested that the website be updated. This batch adds one new Publications record and its Text/BibTeX/RIS Cite exports. It does not add a Research card, PDF, preview, demo, news item or CMS feature because no corresponding asset or separate placement instruction was supplied.

## Source and implementation

- User source: IEEE BibTeX key `11718031`, title `An LLM-based Multi-modal Framework for Comprehensive mmWave Data Synthesis, Understanding, and Reasoning`, seven authors in the supplied order, 2026, pages 1–14, DOI `10.1109/TMC.2026.3739401`.
- Independent metadata check: Crossref API queried on 2026-10-28 at `https://api.crossref.org/works/10.1109/TMC.2026.3739401`. It returned HTTP 200 and matching title, author order, publisher IEEE, container `IEEE Transactions on Mobile Computing`, 2026 publication year, pages `1-14`, DOI, and IEEE document URL `https://ieeexplore.ieee.org/document/11718031/`. No volume or issue was present.
- Website data: `p76`, `sourceNumber: 76`, journal type, `IEEE TMC`, HTTPS DOI URL, and `verification: verified`.
- Cite data: `src/data/citations/p76.{txt,bib,ris}` and the `p76` entry in `sources.json`, using IEEE style. The publication page therefore has 75 records, 74 paper/book links, and 74 Cite entries; p03 remains the sole no-link/no-Cite record.

## Verification

- `astro check`: 59 files, zero errors, warnings or hints.
- Root and `/WiNet-Lab/` static builds: 24 pages each, including all three p76 citation routes.
- Playwright Home/Publications regression: 17 tests passed. The tests cover 75 records, the p76 DOI link, author order, sorting, filters, no-JavaScript access, mobile widths and accessibility.
- `scripts/check-publication-citations.mjs`: passed for both bases. It verified 74 publications × 3 formats, 222 static/HTTP citation files, p76's dialog copy/download behavior, the publication link, no-JavaScript fallback, 390/1440px dialog bounds and axe checks.
- `scripts/check-base.mjs`: passed for `/WiNet-Lab/`, confirming 75 records, 74 publication links, navigation, CSS, filters, mobile menu and no failed requests.
- Local preview `http://127.0.0.1:4321/publications/`: HTTP 200; p76 title and IEEE TMC venue present.

This technical verification is not user acceptance and does not authorize a GitHub push. The local checkpoint is `ce0055b`; the remote branch was not changed.

## Visibility follow-up

The user reported that the paper was not visible on Publications or Home. Direct HTTP inspection showed p76 was present in Publications but appeared last among the fourteen 2026 records because the established same-year order used ascending `sourceNumber`; Home had no corresponding News item. The follow-up adds an October 2026 Home announcement with the complete title and IEEE TMC venue, and introduces optional `displayPriority` sorting so p76 appears first in the 2026 Publications group while retaining `id: p76` and `sourceNumber: 76`.

Follow-up verification passed: `astro check` reported zero diagnostics; root and `/WiNet-Lab/` builds each generated 24 pages; the 17 Home/Publications Playwright tests passed; citation checks passed for both bases; and the `/WiNet-Lab/` integration check confirmed 75 publications with no failed requests. The citation check's no-JavaScript first-download assertion was updated from the former first record p01 to the intentionally promoted p76. Direct browser review at `http://127.0.0.1:4321/` confirmed the October 2026 announcement is first in News, and `/publications/` confirmed p76 is first in the 2026 group with its paper link and Cite control visible. This remains technical verification pending user acceptance; no GitHub push was made.

## Release authorization

On 2026-10-28, after reviewing the local result, the user explicitly requested that this update be pushed to the GitHub remote repository. The authorized target is `https://github.com/zjugxz/WiNet-Lab.git`, branch `main`. Unrelated existing workspace changes are excluded from this release.

The four authorized commits were pushed from remote head `b26110a` through `4085f26`. GitHub Actions run [40644112049](https://github.com/zjugxz/WiNet-Lab/actions/runs/40644112049), `Publish WiNet Lab preview` run 27, completed successfully for head `4085f26093f83751a637ff60413f6b7623b550dd`. Post-deployment HTTP checks confirmed that both the public Home page and Publications page contain the complete paper title and that p76 precedes p01 in the rendered publication order. Existing unrelated edits to `docs/github-hosting.md`, `.zcodeignore`, and the personal-homepage audit were not committed or pushed. Deployment verification is not user acceptance of the rendered result.
