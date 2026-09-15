# Content maintenance and planned editing tool

Updated 2026-09-15. The website is English-only; the online content editor is required but not implemented.

## Editing at this milestone

src/data/home.json contains hero copy, group introduction, and the News empty-state text. The headline accepts a newline for intentional line breaks. Events and Collaborators were removed at the user's request; do not restore those fields or sections without a new request. src/data/site.json contains site name, description, and navigation. Astro escapes these plain-text fields.

After a developer edits data, the development preview updates automatically. Production output must be regenerated with npm run build. JSON files are not yet a user-facing form tool, and News is not yet a record list. Arbitrary arrays will not render at this milestone.

Introductory slogans and graphics are drafts. Actual group description, affiliation, topics, publications, member details, photos, approved logo, and news are still needed. The teacher's GitHub-related email is not approved public contact information.

## Online tool proposal — separate approval required

Intended workflow: an authorized editor signs in, fills out forms, previews a draft, and chooses Publish. A repository commit then triggers a static rebuild and updates the site. Ordinary record editing would not require page-code changes.

Candidate: Decap CMS with a GitHub backend, editing the same structured content used by Astro. GitHub Pages cannot host the necessary OAuth backend. Authentication hosting, repository permissions, maintainers, possible costs, and access from China must be decided before implementation. No CMS vendor or authentication service has been approved.

Proposed forms: site settings, Home, news, research, publications, people, and contact details. Events and Collaborators are outside the current scope. The implementation must define stable IDs, required fields, dates, images/alternative text, drafts, and validation. Implement and test actual collection rendering with those forms, sharing schemas rather than duplicating content rules across pages.

Before automatic publication, obtain full-project acceptance and verify the repository. Form submission must preserve the agreed draft/review/publish distinction. Credentials belong in the approved authentication service, never frontend JSON.

## Handoff

Read AGENTS.md, requirements, and progress first. Work only on the approved subtask and preserve unrelated edits. Update affected notes and verification evidence, run proportionate checks, and make a local Git commit. Record user acceptance separately from successful tests. Do not push before full-project acceptance.
