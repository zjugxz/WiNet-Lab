# Gallery 新增两张 2026 年照片（2026-10-20）

## 范围与验收标准

用户提供 `resources/Gallery/2026/` 中两张新 JPG：茶园步道合影和傍晚集体照。加入现有 2026 分组，不改 Gallery 的静态三列、年份倒序和等比例展示。验收以五张照片可正常加载、竖图不裁切、无布局溢出、两种 base 构建及浏览器检查通过为准。原始 JPG 保留在 Git 忽略目录，公开站点只使用优化后的 WebP。

## 实现

- `...103_3.jpg` 转换为 `public/gallery/2026/photo-2.webp`（960×1280，322278字节），`...104_3.jpg` 转换为 `photo-3.webp`（1280×960，164192字节）。转换使用 sharp 的 EXIF 方向处理、最长边不超过 1280px、不放大、WebP quality 82；没有裁切。
- `gallery.json` 在现有 2026 组追加两条记录，alt 仅描述照片中可见内容。五张照片均记录实际像素尺寸，页面据此设置图片的 HTML 宽高属性，避免竖图加载前预留横版比例。
- Gallery 专项检查和导航回归计数更新为五张；专项检查核对新图路径、尺寸属性、完整加载及等比例展示。

## 验证与状态

- `astro check`：59文件，0错误/警告/提示。根路径和 `/WiNet-Lab/` 两种 base 构建均成功，各24页。
- `scripts/check-gallery.mjs` 在两种 base 均通过：5张WebP完整加载且尺寸属性与自然尺寸一致、2026组有3张、等比例无裁切、静态不可点击、无横向溢出和axe问题、无失败请求。
- `scripts/check-base.mjs` 子路径全站检查通过。Playwright `tests/home.spec.ts` 的9项断言均显示通过；测试进程在结束服务器时未退出，手动中止，因此不能记为完整正常退出。
- 已目视核对 `.tools/gallery-root-1440.png` 与 `.tools/gallery-root-390.png`：新竖图和横图均完整可见，桌面三列/手机两列排列，后续年份分组未重叠。

## 发布（2026-10-20）

用户明确要求上传到 GitHub。推送前从 `origin` fetch，确认本地 `main` 比远程仅多2个提交：先前独立的个人主页跳转发布文档提交 `63928b9` 与本次 Gallery 功能提交 `b3d466c`；远程无新提交，可快进。待推送对象清单不含 `resources/`、PDF、DOCX 或 XLSX；原始 JPG 保持 Git 忽略状态。通过本机代理推送 `2767397..b3d466c` 到 `origin/main`。

[GitHub Actions #39396711238](https://github.com/zjugxz/WiNet-Lab/actions/runs/39396711238) 已完成，结论 `success`。线上 `https://zjugxz.github.io/WiNet-Lab/gallery/` 返回 HTTP 200，页面包含5张照片并引用两张新图；线上 `photo-2.webp`（322278字节）和 `photo-3.webp`（164192字节）的 SHA-256 均与本地公开文件一致。此为技术发布验证，等待用户实际查看确认；不记为用户验收。
