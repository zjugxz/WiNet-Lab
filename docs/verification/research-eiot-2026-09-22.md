# Research 第三方向首批论文录入（2026-09-22）

## 范围

用户在 `resources/{paper,display,.demo}/Embodied Intelligence of Things/` 下新增两篇论文资料，要求补充到 Research 页第三方向；其中 Privacy Preserving Two Hand Reconstruction Using Millimeter Wave Radar for Sign Language Understanding 尚未录用，不得提供 PDF 下载。仅本地实现，不 push。

## 资料核对

- **mmExpert: Integrating Large Language Models for Comprehensive mmWave Data Synthesis and Understanding**（PDF 页眉 "MobiHoc '25, October 27–30, 2025, Houston, TX, USA, Yan et al."，判定为 ACM MobiHoc 2025 已发表）：PDF 17.1MB、display 视频 37.0MB（71.5s，1280×720 H.264+AAC，4.14Mbps）、demo 视频 5.8MB（112.5s，H.264 无音轨，410kbps）。未提供 Text/BibTeX/RIS 引用资料，故无 citationId/Cite 入口（如需可后续补充）。
- **mmPRISM（Privacy Preserving Two Hand Reconstruction ... for Sign Language Understanding）**：PDF 3.0MB（未录用，`pdf: null` 屏蔽）、display 与 demo 的 1.mp4 SHA-256 完全一致（6.27MB，51.6s，971kbps，moov 已前置）。

## 处理

- 网站副本 `public/research/mmexpert/`：paper.pdf（原字节）、preview.mp4（display 经 encode-preview.mjs 压缩：37.01→3.94MB，H.264 CRF23/slow、720p 不放大、AAC、faststart）、poster.jpg（预览第20秒）、demo.mp4（demo 原字节）。
- `public/research/mmprism-sign-language/`：preview.mp4（display 原字节共享，参照 Mighty 先例——display 与 demo 同文件且码率已低、压缩收益小 6.27→5.36MB）、poster.jpg（第15秒）；demo 下载复用同一文件，filename `mmprism-sign-language-demo.mp4`；无 paper.pdf，旧 URL 404 由检查覆盖。
- 三份副本与 resources 原件 SHA-256 核对一致；resources 原件未动。
- research.json 第三方向 papers：mmexpert（venue "ACM MobiHoc" 2025 published，venue/year 取自 PDF 页眉）在前，mmprism-sign-language（仅 status submitted，无刊会/年份）在后；两者均有 demo，排序规则不变。简介依 PDF 摘要/引言整理，未虚构。

## 验证

- astro check 零错误；根路径与 /WiNet-Lab/ 两种 base 构建 21 页。
- check-research-downloads.mjs（更新 withheldIds+计数）两种 base 通过：7 个视频、4 条刊会样式行、4 个 Paper coming soon（含 mmPRISM 禁用态）、mmprism paper.pdf URL 404 且 public/构建产物无该文件、11 项下载字节逐一与 public 副本一致。
- check-media-performance.mjs（计数 5→7）通过：manifest 新增 2 预览/3 下载条目全部哈希核对；仍只有首屏两卡请求视频，其余临近视口加载；无 JS 回退 7 视频可见。
- check-research-citations.mjs 通过：3 篇 Cite 不变（mmExpert 无引用资料，不生成入口），受限 URL 检查正常。
- 17 项 Playwright 回归通过；4321 开发预览 /research/ 200 且含新内容。第三方向桌面（双列、刊会标签、Paper coming soon 禁用、Demo 按钮、视频画面）与手机 390px（单列、无溢出）截图目视通过（.tools/eiot-direction-*.png）。

## 补充：mmExpert Cite 入口（同日）

用户要求 mmExpert 与既有已发表论文一样提供 Cite 按钮。书目来源：PDF 页脚 DOI `10.1145/3704413.3764420`（与页眉 MobiHoc '25 一致）→ DOI 内容协商取得权威 BibTeX，与 publications.json 已核验记录 p38 逐项一致（7位作者顺序、会议全称、2025、页1–10、在线2025-10-23）。据此新建 `src/data/citations/mmexpert.{txt,bib,ris}`（Text 为 IEEE 会议样式含会议全名、BibTeX 保护 mmExpert/mmWave 缩写、RIS 为 TY CONF 无卷期）及 sources.json（doi.org 链接、IEEE 样式标注）；research.json 加 `citationId: "mmexpert"`。check-research-citations.mjs 适配：4 篇计数、TY 按记录类型 JOUR/CONF 断言、no-JS 链接计数、动态消息。两种 base 全过：4×3 格式查看/复制/下载与 HTTP 内容一致、p38 字段交叉核对、键盘/无JS/回退/四宽度/axe；下载回归、17 项测试不受影响；4321 预览确认 Cite: mmExpert 按钮。

## 补充：全部研究简介改为一句话（同日）

用户要求Research页所有研究简介改为MARS式一句话概括。8篇summary均压缩为单句（忠实原摘要要点：做什么+关键机制/收益，不新增事实；eeg原本即为一句仅微调）。下载/引用/排序等检查不依赖summary，复验通过（零错误、21页两种base、下载回归、17项测试）；整页截图目视确认每卡一句、卡片高度更均匀（[截图](research-eiot-2026-09-22-oneliner.png)）。本地Git提交，未push。

## 边界

- 未 push；mmPRISM PDF 恢复须用户录用后另行授权；resources 原件不入库。mmExpert Cite 已按上节补充完成。
