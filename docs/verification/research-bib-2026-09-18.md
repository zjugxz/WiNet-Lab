# Research BibTeX引用组件

2026-09-18（Asia/Shanghai）。开始HEAD6391b28，工作区干净。用户要求为已录用paper增加Bib组件并参考出版机构引用规范。本轮完成Research现有3篇已发表论文的本地功能，不改Publications、不恢复未录用PDF、不自动上传GitHub。技术验证不等于用户验收。

## 引用资料与规范

本日查阅[ScienceDirect引用导出说明](https://www.elsevier.support/sciencedirect/answer/how-can-i-export-my-citations)及[IEEE Xplore引用导出界面](https://ieeexplore.ieee.org/assets/html/download_citations-v2.html)：两者均支持BibTeX，IEEE官方[功能说明](https://innovate.ieee.org/wp-content/uploads/2023/03/2023-IEL-IEEE-Electronic-Library-Brochure-1.pdf)也说明Cite This可复制或下载引用。BibTeX提供书目字段，最终参考文献的标点、作者缩写及排版由引用者所用期刊模板/bibliography style决定，不在网站中强制一种投稿模板。

资料核对如下，作者完整名单和顺序逐一与出版方向Crossref登记的记录一致：

| Research条目 | 正式书目信息 | 核对来源 |
| --- | --- | --- |
| magnetic-rf-computing | Device，2026，文章号101241，DOI 10.1016/j.device.2026.101241；7位作者 | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2666998626001936)、[Crossref登记](https://api.crossref.org/works/10.1016/j.device.2026.101241) |
| mechanical-metasurface | Cell Reports Physical Science，2026，7(7)，文章号103402，DOI 10.1016/j.xcrp.2026.103402；8位作者 | [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2666386426003085)、[Crossref登记](https://api.crossref.org/works/10.1016/j.xcrp.2026.103402) |
| mighty-drone-backscatter | IEEE Transactions on Mobile Computing，2025，24(3):1833–1845，DOI 10.1109/TMC.2024.3486993；8位作者 | [DOI/IEEE入口](https://doi.org/10.1109/TMC.2024.3486993)、[Crossref登记](https://api.crossref.org/works/10.1109/TMC.2024.3486993)、[作者所在大学出版记录](https://collaborate.princeton.edu/en/publications/mighty-towards-long-range-and-high-throughput-backscatter-for-dro/) |

ScienceDirect文章可检索内容与Crossref元数据相符；直接打开全文页及IEEE DOI在本轮网页工具中失败，未声称从IEEE Xplore实际点击导出了原文件。三条Crossref API元数据及`/transform/application/x-bibtex`均已实际读取，作为出版方登记信息的补充来源。组件所用文件是按核实字段整理的BibTeX，不是宣称未经修改的官方导出附件。

整理规则：使用`@article`、完整作者且以`and`分隔、期刊全称、正式出版年、已知卷期/页码或文章号、DOI和https DOI链接。保留RF和Mighty的大小写保护；页码范围用BibTeX的`--`，月份使用标准`jul`/`mar`宏；文章号按导出记录放入pages兼容常用BibTeX样式。省略摘要、关键词等非必要字段。两篇Tan 2026分别使用唯一引用键，避免合并bib时冲突。

Device记录当日仍没有卷号/期号，页面检索信息为In Press/Corrected Proof，因此不推测卷期。Mighty用正式卷期年2025，不把DOI中的2024或旧Early Access版本当作卷期年。稿件投稿中的3篇不配置Bib，不填目标刊会/年份。

## 实现与维护

- `src/data/citations/*.bib`为唯一引用正文；`research.json`的可选`bibtex`字段引用对应文件名（不带扩展名）。例如`"bibtex": "magnetic-rf-computing"`。
- `research.ts`仅允许`publication.status: published`的论文配置Bib；缺源文件构建报错。`lib/citations.ts`统一读取和换行，显示、复制和下载共用同份文字。
- `BibCitation.astro`复用组件在Paper/Demo旁显示30px高的Bib小按钮和花括号图标。点击打开原生dialog，提供只读可选择BibTeX、Copy BibTeX、Download .bib；支持Esc、关闭按钮、点击遮罩和关闭后焦点返回，Tab/Shift+Tab在弹窗中循环。
- 剪贴板不可用或权限被拒时，不误报成功；自动选中文本并提示手工复制或下载。关闭JavaScript时Bib入口直接下载文件。页面渲染和复制无需访问第三方服务。
- `src/pages/research/citations/[id].bib.ts`在构建时仅为数据中引用的已发表条目生成3个静态文件，根路径和/WiNet-Lab/均可访问，不需常驻后端。不要把未获准引用或PDF放入public。

新增已录用论文时，先核对官方作者顺序、DOI、正式年份及卷期信息，再新增.bib源文件并填bibtex字段；若卷期尚未分配则省略。Bib配置不改变PDF开放权限，恢复论文下载仍按原规则确认。

## 验证

- 最终Astro检查36文件，零错误、警告和提示；Git差异空白检查通过。实际4321开发页HTTP 200，包含3个Bib入口。
- 根路径及/WiNet-Lab/各构建5页和3个静态.bib文件。
- `scripts/check-research-citations.mjs`在两个base均通过：三篇逐条打开、真实剪贴板读取（仅规范化Windows系统CRLF）、下载文件名和完整内容比对、HTTP返回内容一致；投稿论文无Bib且候选Bib/PDF URL均404。
- 两个base均通过Enter/Space打开、Esc/按钮/遮罩关闭、焦点返回、Tab循环、剪贴板拒绝时手动复制回退、无JS真实下载。320/390/768/1440px弹窗不溢出，WCAG 2 A/AA自动扫描无违规；390/1440px截图目视检查通过，截图留本地.tools/research-bib-{width}-{root|base}.png。
- `scripts/check-research-downloads.mjs`两个base均验证原有稳定排序、投稿状态/刊会字体、受限PDF404、8项原Paper/Demo下载字节和4种宽度，均通过。
- `scripts/check-base.mjs`通过五页导航、CSS、词云、74条Publications/筛选及手机菜单，无失败请求。

本轮只改引用组件、引用资料/接口、静态导出及文档，没有修改原媒体、公开PDF或Publications内容。代码与文档一并本地Git保存，等待用户查看[本地Research](http://127.0.0.1:4321/research/)；本轮未push，线上仍为此前发布版本。
