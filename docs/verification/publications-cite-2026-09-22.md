# Publications全条目Cite引用

2026-09-22，Asia/Shanghai。用户要求为Publications页所有已发表论文增加与Research页完全一致的Cite功能（按钮/图标/交互一致），且必须逐篇访问论文网站取得真实可用的引用信息。本轮本地实现并验证，未push，不记录为用户验收。

开始时工作区含上一会话未提交的视频性能优化改动（preview重编码、research.json、research-video.ts等），本轮未触碰这些文件，仅新增/修改引用与Publications相关文件，两者共存于同一工作区。

## 范围界定

- 74条中73条提供Cite：p01–p75除p03。p03（npj Flexible Electronics 2026）无DOI、无出版入口、审计状态unconfirmed，且与Research页仍在投稿的cardiac monitoring为同一篇；无法从任何官方网站取得真实引用，不提供Cite入口（与站内"p03无链接"的现状一致）。
- p71已删除条目及受限PDF边界不变。

## 资料来源与核验（逐篇真实抓取）

68条Crossref DOI（2026-09-22实际请求，直连无代理）：

- CSL JSON与Text：`https://doi.org/{doi}`内容协商（`application/vnd.citationstyles.csl+json`；Text按`text/x-bibliography`，style=ieee，p01/p02两篇Cell Press刊用style=cell，沿用Research页既有样式映射）。
- RIS底稿：`https://api.crossref.org/works/{doi}/transform/application/x-research-info-systems`。
- 原始响应缓存于`.tools/citation-cache/`（不入库）。

非Crossref条目逐个访问官方网站：

| 条目 | 来源 | 处理 |
| --- | --- | --- |
| p23 | USENIX NSDI'22 presentation页（实际读取） | 官方BibTeX块，Text/RIS按同一字段组成IEEE样式 |
| p43 | USENIX NSDI'22 presentation页（实际读取） | 同上 |
| p34 | CRAD期刊官网文章页（DOI为ISTIC注册，Crossref无记录；实际读取） | 官方页面meta（作者/卷期页码/来源）组成GB/T 7714 |
| p37 | CCF数字图书馆文章页（实际读取） | 页面确认题名/作者/刊名；卷19(4):1-4沿用站内已展示的用户文档值 |
| p70 | EWSN官方PDF（实际下载，1.48MB） | 按审计已核对的官方记录组成；PDF为子集字体无法抽文本，未声称通读 |

## 数据甄别（Crossref与站内核验记录的全部差异及处理）

差异18条，全部逐条处理并记录：

- 截断题名7条（p24/p28/p29/p30/p51/p60/p61，ACM存档只登记短题名如"RF-transformer"）：Text替换为站内审计核验的完整题名；BibTeX/RIS同源。
- 存档格式噪声：p11题名含LaTeX（`$\textsf{Lotus}$`）、p14含HTML（`<i>Twaltz</i>`）、p41/p42/p73/p74刊名含`&amp;`，全部清理为正式文本。
- 在线优先年份3条（p31/p33/p56，Crossref issued为在线年）：站内与卷期年一致，Text中年月替换为出版社登记的印刷卷期（p31/p56 Feb. 2022、p33 May 2023），RIS PY/DA、BibTeX year/month同口径；与Research页Mighty（印刷2025）先例一致。
- p02（Device）Crossref新增卷4(9)：引用文件收录出版社新登记的卷期，站内展示字段未改动。
- p75（Springer专著）：补全副标题"Fundamentals and Key Technologies"（Crossref subtitle字段+站内核验），RIS类型BOOK、保留ISBN 9789819937189；专著 extent "XV, 183" 不是起止页，引用不含SP/EP。
- 其余50条Crossref与站内数据（题名/作者顺序/年/刊会/卷期/页码/DOI）完全一致。

## 功能实现

- 复用`CitationDialog.astro`（按钮、引号SVG图标、Text/BibTeX/RIS切换、复制、下载、View publication外链、无JS回退与键盘/焦点行为与Research页同一组件，零视觉差异）；新增`section`参数。
- `lib/citations.ts`：`getCitation(id, section)`按section生成下载地址；textStyle枚举增加`GB/T 7714`（中文条目p34/p37）。`lib/citation-routes.ts`：citationPaths支持publications section，静态导出219个文件（73×3）到`/publications/citations/{id}.{txt,bib,ris}`；Research既有`/research/citations/`12个文件与URL不变。
- `lib/publications.ts`：以sources.json为注册表导出`citationIdFor`，p03不在注册表故无按钮；条目级开关不改动publications.json数据。
- `PublicationCard.astro`：Paper↗与Cite同行展示；筛选搜索索引克隆节点并剔除citation-dialog内容，搜索行为与之前一致（'wizig'仍为2条）。
- sources.json新增73条注册（p01/p02指向ScienceDirect文章页、p34指向CRAD官网页、p23/p43/p37/p70指向各自官方页、其余为DOI链接），保留Research 4条，共77条。

## 验证

- `astro check` 52文件零错误/警告/提示；根路径与/WiNet-Lab/两种base构建21页，分别导出219+12个引用文件。
- 新增`scripts/check-publication-citations.mjs`两种base通过：73条×3格式静态核对（RIS TY/TI/T2/AU顺序/PY/DO/SP-EP/VL/IS、BibTeX类型/题名/作者/年/venue/卷/页/DOI、Text含题名/刊会/年/DOI、ER终止符、sources.json覆盖与URL https）；219个URL逐个HTTP 200且内容与源文件逐字节一致；p03三格式URL均404且卡片无citation-dialog。
- 浏览器抽查p01(Cell)/p16(IEEE)/p23(无DOI会议)/p34(GB-T中文)/p75(专著)：弹窗打开、样式标签（Cell/IEEE/GB/T 7714 style）、View publication指向sources登记页、三格式切换与文本框内容、真实剪贴板复制、下载文件名与字节、HTTP内容一致、Esc关闭并归还焦点，两种base全部通过。
- 390/1440px弹窗无横向溢出，axe WCAG 2 A/AA零违规；无JS时Cite默认下载p01.txt、BibTeX/RIS回退链接各73个可下载；搜索'wizig'仍为2条。
- 既有17项Playwright测试通过（6.4s）；`check-research-citations.mjs`两种base回归通过（Research Cite不受影响）；`check-base.mjs`子路径全站检查通过（74条、筛选、无失败请求）。
- 实际4321开发预览：73个data-cite-open按钮、p16.bib/p34.ris 200、p03.txt 404；桌面/手机截图目视核对（弹窗两种文字样式、卡片按钮排布、背景变暗、无溢出）。

## 维护说明

- 后续新增论文：在Crossref/官方网站核对后，将三个引用文件放入`src/data/citations/{id}.*`并在sources.json登记（url+textStyle），按钮与静态导出自动出现；缺任一格式构建失败。
- 生成用脚本存于`.tools/fetch-citation-data.mjs`与`.tools/generate-publication-citations.mjs`（含全部甄别规则与手工条目），未纳入版本库；引用文件本身是交付物。
- p03发表证据（DOI或出版社页面）到位后，补齐三个文件与sources条目即可启用其Cite。

代码、引用资料、验证脚本与文档一并本地Git提交（与视频优化未提交改动分开提交），未push；等待用户查看http://127.0.0.1:4321/publications/ 并反馈，不记为用户验收，不自动发布。
