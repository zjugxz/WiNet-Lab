# Content maintenance and planned editing tool

Updated 2026-09-15. The website is English-only; the online content editor is required but not implemented.

The user explicitly declined the proposed local content-management tool. The current priority is integrating real material into the initial five-page website; the final online editor follows. Do not build a local editor as an intermediate deliverable. Keep content separate from presentation so the final editor can use the same data. The user has now supplied the Home introduction, word cloud, and seven News records; other page records are still pending.

## Editing at this milestone

src/data/home.json contains hero copy, heroImage metadata, about.paragraphs (three user-supplied paragraphs rendered individually), and news.items. Each news record contains a unique id, date in YYYY-MM format, and text. Records display in descending month order, retaining input order within the same month. The headline accepts a newline for intentional line breaks. heroImage.src is relative to public/; width/height record original image dimensions and alt describes it in English. The current source is public/images/winet-lab-wordcloud.png. Events and Collaborators were removed at the user's request; do not restore those fields or sections without a new request. src/data/site.json contains the canonical name WiNet Lab, description, and navigation.

After a developer edits data, the development preview updates automatically. Production output must be regenerated with npm run build. News now renders the structured records described above; the four inner pages remain placeholders. JSON files are not a user-facing form tool and do not replace the planned online editor.

The three About paragraphs, lab's full name, Zhejiang University affiliation, word-cloud image, and seven News records were supplied by the user and are now integrated. The News wording retains the supplied journal titles and first-person award statement; the Chinese award note was rendered as Category B to keep the site English-only. Remaining hero slogans and the small brand mark are design drafts. Detailed research projects, publications, member details/photos, and final logo are still needed. The teacher's GitHub-related email is not approved public contact information.

## 修改加粗和新闻内容

当前工作区中用户已从 src/pages/index.astro 移除顶部简介的渲染段落，因此 introduction 字段虽保留，但不再显示在首页主标题下方。下方关于 introduction 的加粗能力只适用于重新启用该段落的情况。

打开 [home.json](../src/data/home.json)：

- 介绍正文：about.paragraphs 下的三段字符串。
- 新闻正文：news.items 中每条记录的 text。
- 顶部简介：introduction。

在需要加粗的文字两侧分别加两个星号。例如：

```json
"text": "Our work “**BCGscatter**” on low-power bio-interface was accepted by **Nature Portfolio Flexible Electronics**!"
```

页面显示时星号会转成加粗；删去两侧星号即可取消加粗。仅上述正文位置支持此写法，标题、日期、图片说明等其他字段目前按普通文字处理。标记应成对、放在同一段内；无需填写 HTML 标签。保留 JSON 的双引号与逗号，字符串中如果使用英文直双引号，需要写为 `\"`。

粗体显示由 [global.css](../src/styles/global.css) 中的 strong 规则统一控制，目前为 font-weight: 700。日常选哪些文字加粗只改内容文件。

当前 localhost:4321 是生产预览，保存 JSON 后需重新构建再刷新。在项目根目录的 PowerShell 中可使用现有本地 Node：

```powershell
& '.\.tools\node-v24.21.0-win-x64\node.exe' '.\node_modules\astro\bin\astro.mjs' build
```

若使用 npm run dev 启动的开发预览，则内容保存后自动更新。上述操作只影响本地预览，不上传 GitHub。

## Logo and footer maintenance

The latest logo proposal is implemented and awaiting user acceptance. Edit the icon geometry and its indigo (#5054a6), teal (#168577), and orange (#df8150) colors in [Mark.astro](../src/components/Mark.astro). [Brand.astro](../src/components/Brand.astro) combines this SVG with the name from site.json; its optional header descriptor is Wireless Intelligence. The .brand-name rules in [global.css](../src/styles/global.css) control the gradient wordmark and typography. Both header and footer use the same components; do not create separate copies of the logo. The footer upper row contains only the centered brand. Footer layout lives in [Footer.astro](../src/components/Footer.astro) and .footer-top styles. These are design settings, not routine News/content edits. No online logo editor has been implemented.

## Online tool proposal — separate approval required


Intended workflow: an authorized editor signs in, fills out forms, previews a draft, and chooses Publish. A repository commit then triggers a static rebuild and updates the site. Ordinary record editing would not require page-code changes.

Candidate: Decap CMS with a GitHub backend, editing the same structured content used by Astro. GitHub Pages cannot host the necessary OAuth backend. Authentication hosting, repository permissions, maintainers, possible costs, and access from China must be decided before implementation. No CMS vendor or authentication service has been approved.

Proposed forms: site settings, Home, news, research, publications, people, and contact details. Events and Collaborators are outside the current scope. The implementation must define stable IDs, required fields, dates, images/alternative text, drafts, and validation. Implement and test actual collection rendering with those forms, sharing schemas rather than duplicating content rules across pages.

Before automatic publication, obtain full-project acceptance and verify the repository. Form submission must preserve the agreed draft/review/publish distinction. Credentials belong in the approved authentication service, never frontend JSON.

## Handoff

Read AGENTS.md, requirements, and progress first. Work only on the approved subtask and preserve unrelated edits. Update affected notes and verification evidence, run proportionate checks, and make a local Git commit. Record user acceptance separately from successful tests. Do not push before full-project acceptance.
