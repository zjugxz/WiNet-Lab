# P0 媒体带宽优化实施与验证（2026-09-22）

依据：[性能诊断](performance-diagnosis-2026-09-22.md)（GitHub Pages 跨境实测约 1.1–1.4 Mbps）。用户当日批准执行 P0；"降级为 GIF 式纯循环"为后备方案，本轮未采用。仅本地实施，未推送，不代表用户验收。

## 实现

- **预览重编码**：magnetic-rf、cardiac、mechanical-metasurface、mmprism 四段以 `scripts/encode-preview.mjs`（新增可选 `--height`/`--maxrate`，默认行为不变）从 `.tools/media-optimization/originals` 原片重编：540p 上限、CRF23+maxrate 650k/slow、保全部时长与 AAC 原音轨、faststart。eeg/mighty/mmexpert 码率本已在预算内，未动。
- **单一活跃缓冲队列**（`src/lib/research-video.ts` 重写）：可见且未被访客暂停的视频中，同一时刻只有"可见比例最高（5% 分桶）"且尚未完整入缓存的一段占用连接播放；其余停在 poster。已完整缓冲的循环播放（不再耗带宽）与访客手动播放不受限。分桶+DOM 序决胜避免同排卡片被亚像素布局噪声随机抢槽。200px 提前量仅取 metadata 不变。
- 修复实施中发现的两个竞态：① 同排等可见时槽位被亚像素噪声随机分配；② 访客按空格暂停瞬间若有未决 play()，浏览器后补的 play 事件会清掉 userPaused 复活播放并与队列乒乓——现在只有访客自己的播放才解除 userPaused，过期 play 事件立即补停。
- **mmprism Demo 分离**：其 preview 原与 Demo 下载共用文件（Mighty 先例），重编码会连带降低 Demo 质量；现按 metasurface 模式将原字节另存 `demo.mp4` 供下载，`research.json` demo.src 改指新文件。此前副本已在 originals 备份；mmprism preview.mp4 工作区只读属性已移除（git 模式仍 100644）。
- poster：七段自 09-18/09-22 起已有 poster.jpg 并被组件/数据引用，线上亦生效，本轮无改动（诊断初稿"无 poster"表述已在诊断文档更正）。

## 体积与码率变化

| 预览 | 优化前 | 优化后 | 总码率 | SSIM(对原片) |
| --- | ---: | ---: | ---: | ---: |
| magnetic-rf-computing | 12.22 MiB | 3.47 MiB | 2359→701 kb/s | 0.934 |
| cardiac-monitoring | 6.22 MiB | 2.72 MiB | 1488→649 kb/s | 0.981 |
| mechanical-metasurface | 11.95 MiB | 6.86 MiB | 1275→731 kb/s | 0.977 |
| mmprism-sign-language | 5.98 MiB | 3.24 MiB | 972→527 kb/s | 0.989 |
| 七段预览合计 | 51.26 MiB | 33.28 MiB | 最高 731 kb/s | — |

全部低于实测链路下限 1.1 Mbps。SSIM 为 540p 结果放大回原尺寸与原片全片对比；1440 截图目视核对（analyze_image）文字清晰可读、无块效应，布局完好。

## 验证

- astro check 49 文件零错误/警告/提示；root→dist、/WiNet-Lab/→.tools/base-dist 两种构建各 21 页成功。
- `scripts/check-media-performance.mjs` 两种 base 通过：manifest 全部 sha256/大小、moov 前置、5 视口选图、首屏仅前两段视频请求、五段真实解码与回绕循环、滚动/手动暂停恢复、手机与无 JS 回退。第二段起播轮询超时放宽至 30s 并注明原因（队列设计为首段完整入缓存后才放行下一段，Chromium 还会短暂挂起文件尾段）。
- `scripts/check-research-downloads.mjs` 两种 base 通过 11 项精确字节下载（含 mmprism 新 demo.mp4 原字节）、排序/刊会/受限 404。
- `scripts/check-research-card.mjs` 两种 base 通过单夹具静音自动播放/循环/暂停恢复/布局/无障碍。
- 17 项 Playwright 测试全部通过。
- 竞态回归：将检查脚本中"空格暂停→滚动→回滚"场景以相同即时轮询节奏连续 5 轮复现，修复前 1/5 失败（暂停被复活），修复后 5/5 通过。
- 4321 开发预览已重启并实测：新 preview/demo 字节数经 HTTP 验证，research 页 7×2 处 poster 引用齐全。

## 已知取舍

- 同排两段视频只有一段先播，另一段停留 poster 直至前者完整入缓存（本地约 10s，慢链路约 25–35s）；Chromium 会暂停下载尾段数秒再续，属浏览器行为。访客手动播放任意一段可立即并发。
- magnetic 原片运动量大，540p 压缩后 SSIM 0.934 为四段最低；卡片显示宽度下文字仍清晰。如需更高保真可回退该段（其 842 kb/s 前值在链路上限附近仍会卡顿，不建议）。
- "完整加载"仍受跨境链路上限约束；本轮保证的是单段起播快、播放不中断、逐段接管带宽。

## 交付状态

代码、4 段新 preview、mmprism 原字节 demo.mp4、manifest、检查脚本与文档为本地提交，未 push。诊断脚本 `.tools/media-perf-diag.mjs`、重编码中间产物与调试探针均在被忽略的 `.tools/`。下一步：用户在 http://127.0.0.1:4321/research/ 查看效果；发布需另行明确请求。
