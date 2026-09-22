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

## 边界

- 未 push；mmPRISM PDF 恢复须用户录用后另行授权；resources 原件不入库。mmExpert 如需 Cite 入口，需用户提供或授权核对引用元数据。
