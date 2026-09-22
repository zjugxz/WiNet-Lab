# 正文链接标记 + People 个人链接按钮发布记录（2026-09-22 晚）

用户明确要求"把本地改动都提交到 GitHub 仓库"。推送 `8250e20..8e259c1` 共 5 个提交；Actions 对 `8e259c1` 构建部署 success。技术发布不等于整站验收。

## 上线内容

- `30e265a`/`6146b6e`/`3df273c`：`EmphasisText` 正文标记系统新增 `[文字](https://网址)` 链接（绿色下划线、http(s) 白名单、外链新标签）；组合语法 `**[文字](网址)**` 保持粗体字号不变；首页 About "Dr. Xiuzhen Guo" 链接 https://zjugxz.github.io 。类名由 `.text-link` 改为 `.inline-link` 避免与 global.css 既有同名规则冲突。
- `b72470f`：People 每人链接按钮（MARS 风格）：`people.json` 可选 `website`/`googleScholar`；卡片下图标按钮行（卡片锚点外）+ 详情页图标文字按钮；email 全员必有→16 个邮箱按钮，PI 另有网站与 Scholar；悬浮窗按约定不加。
- `8e259c1`：邮箱按钮点击改为复制地址并就地反馈（2 秒绿底对勾/Copied；clipboard API→execCommand→mailto 三级回退；"Email of {name}" 描述格式）。

## 线上核验（2026-09-22 晚实测）

- 首页 HTML 含 `<a class="inline-link" …><strong>Dr. Xiuzhen Guo</strong></a>`，实测样式 underline/绿/700/16px，target=_blank+noopener。
- People 页按钮齐全：16 邮箱 + PI 网站/Scholar 各一（HTML 另含脚本选择器 1 处 email 匹配属正常）；Scholar 链接保留用户原文 `hl=zh-CN`。
- 真实浏览器（授予剪贴板权限）线上实测：点击 PI 邮箱按钮 → 剪贴板得到 `guoxz@zju.edu.cn`、按钮进入 `copied` 状态、页面不跳转、零页面错误。
- 受限 PDF 抽查仍 404；推送审计确认 5 提交无 PDF/resources 路径。

## 交付状态

发布记录随本提交入库。4321 本地预览继续可用。待用户线上查看反馈；学生 website/scholar 信息后续到货即加字段。
