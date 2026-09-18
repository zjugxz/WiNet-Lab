# Cite多格式引用

2026-09-18，Asia/Shanghai。开始HEAD5e89fc2，工作区干净。用户明确将Bib升级为Cite，并要求Bib、Text等多种引用方式，允许查询论文网页。范围为Research现有3篇已发表论文；本地实现与验证，未上传，不记录为用户验收。

## 来源及内容

已实际阅读[ScienceDirect引用导出说明](https://www.elsevier.support/sciencedirect/answer/how-can-i-export-my-citations)和[IEEE引用导出界面](https://ieeexplore.ieee.org/assets/html/download_citations-v2.html)，两者都提供Text、BibTeX、RIS。故本轮提供这三种离线可用的格式，不把RefWorks/Mendeley账号联动当作普通文本下载实现。

论文对应来源：

| 论文 | 页面与引用来源 | Text样式 |
| --- | --- | --- |
| Physical computing across magnetic and RF domains… | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2666998626001936)，[DOI](https://doi.org/10.1016/j.device.2026.101241) | Cell |
| Mechanically programmable metasurface… | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2666386426003085)，[DOI](https://doi.org/10.1016/j.xcrp.2026.103402) | Cell |
| Mighty… | [IEEE DOI](https://doi.org/10.1109/TMC.2024.3486993)，[Princeton出版与Cite this记录](https://collaborate.princeton.edu/en/publications/mighty-towards-long-range-and-high-throughput-backscatter-for-dro/) | IEEE |

ScienceDirect文章页本轮直接请求返回403，IEEE DOI网页工具不能直接打开；不声称完成了这些页面上的交互导出。已通过[Crossref官方内容协商](https://www.crossref.org/documentation/retrieve-metadata/content-negotiation/)从三个DOI实际取得纯文本：对doi.org使用`Accept: text/x-bibliography; style=cell; locale=en-US`（前两篇）或`style=ieee`（Mighty）。导出为书目样式而非任意手写标点；网站只去除独立引用前的`1.`/`[1]`编号，避免与引用者文稿编号冲突。界面明确显示Cell/IEEE style，不称为出版方未修改的附件。

同时实际取得三个`https://api.crossref.org/works/{doi}/transform/application/x-research-info-systems`记录，RIS保留完整作者及顺序、题名、刊会、年份、日期、卷期/文章号/页码、DOI和URL；删除非必要摘要/ISSN等字段，URL统一https DOI，Mighty起止页拆为SP/EP便于导入。BibTeX沿用上一轮已核对文件。Princeton的Mighty记录独立确认2025、24(3)、1833–1845、8位作者并展示多种引用格式。

两篇Cell文章的Text均按Cell样式输出，期号可能按样式省略，完整已知卷期仍保留于BibTeX/RIS。Mighty Text按IEEE样式使用et al.，BibTeX/RIS保留全部8位作者。Device没有卷期则继续省略，不补造；Mighty正式年份保持2025。三种格式传达同一书目事实，格式差异不视为数据缺失。

## 功能与维护

- 卡片入口为Cite及简洁引号SVG图标。弹窗首次默认Text，通过原生单选控件切换Text/BibTeX/RIS；每种格式有自己的只读正文、Copy按钮、匹配扩展名下载和状态消息。支持键盘方向键切换，隐藏内容不进入Tab序列。
- 增加View publication外链，访问对应ScienceDirect页面或IEEE DOI，新窗口打开。复制/切换不访问外部网络。复制失败选中文本，支持手动复制或下载；切换格式/关闭后清除状态，异步复制旧结果不覆盖新格式状态。
- 无JavaScript时Cite直接下载.txt，另有BibTeX/RIS下载入口；所有格式均可用。保留Esc/关闭按钮/遮罩关闭及焦点返回、手机适配。
- `research.json`中的旧`bibtex`字段迁移为`citationId`，仅`publication.status: published`可配置。引用库为`src/data/citations/{citationId}.{txt,bib,ris}`，`sources.json`登记出版页和Text样式。单个格式的显示、复制、下载共享同份文本，缺少格式文件会构建失败。
- `CitationDialog.astro`替代BibCitation；`lib/citations.ts`统一装配格式。`src/pages/research/citations/[id].txt.ts`、`[id].bib.ts`和`[id].ris.ts`通过共享`lib/citation-routes.ts`只为实际引用的已发表论文静态导出9个文件。固定扩展名保证开发路由不被trailingSlash规则当作页面路径；既有.bib URL保持可用。投稿论文无Cite，三种候选引用URL及受限PDF均404。

后续更新某篇书目时同时更新三个导出文件和来源说明，避免格式之间作者/年份漂移。优先使用出版页导出或DOI服务，不自动为投稿文献生成正式出版引用。BibTeX适用于LaTeX，RIS供文献管理器导入；具体软件导入界面不在本轮浏览器验证范围内。

## 验证与交付

- 最终Astro检查39文件，零错误、警告和提示；根路径、/WiNet-Lab/各构建5页及9个真实引用文件。
- 引用检查独立比对RIS与已核对Publications记录的完整作者顺序、题名、刊会、年、卷期/页码及DOI，同时检查Text/BibTeX的关键字段。
- 两种base分别通过3篇×3格式查看、切换、真实剪贴板、下载文件名/完整字节及HTTP内容一致；默认Text、出版入口、方向键切换、Esc/按钮/遮罩关闭、焦点返回与Tab循环通过。
- 三种格式各自通过复制权限拒绝时的手工复制回退和无JS真实下载；投稿记录所有格式URL/PDF均404。320/390/768/1440px各格式均无溢出，WCAG 2 A/AA自动检查无违规；桌面与手机截图目视通过，保存在本地.tools/research-cite-{txt|bib|ris}-{390|1440}-{root|base}.png。
- 既有Research下载回归两种base均通过排序、刊会样式、投稿状态、8项原资源完整字节、受限PDF404和四种宽度；全站子路径检查通过五页、样式、74条Publications与筛选及手机菜单，无失败请求。
- 重启本项目旧开发预览以刷新重命名组件；实际4321的Research HTTP 200，3个Cite入口，Text/BibTeX/RIS下载均200且Content-Type正确。

代码、引用资料、测试及文档一并本地Git提交，不push；Publications数据、PDF和媒体未改。下一步等待用户查看[本地Research](http://127.0.0.1:4321/research/)的Cite组件并反馈，不自动开始其他页面或发布。
