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
