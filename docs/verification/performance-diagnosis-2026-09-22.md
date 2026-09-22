# 线上加载缓慢诊断（2026-09-22）

用户反馈：网站图片、视频加载都很慢，Research 页展示视频一直无法完整加载。本文记录诊断过程、实测证据与优化建议；**本轮未修改任何代码或媒体文件**，优化范围待用户确认。

## 测试环境与方法

2026-09-22（Asia/Shanghai）在用户本机用 curl 直接测量线上站点 https://zjugxz.github.io/WiNet-Lab/ 的各资源首字节与吞吐，并与国内 CDN 基线、公共镜像对比。视频用 HTTP Range 请求取前 1.5 MiB 计时；同一时刻跨境带宽有波动，本文数字为当时实测，量级结论（差约 30 倍）不受波动影响。

## 实测结果

| 目标 | 结果 |
| --- | --- |
| /research/ HTML 61.7 KB | TTFB 1.10s，全程 1.59s |
| mechanical-metasurface/preview.mp4 前 1.5 MiB | TTFB 1.32s，全程 8.93s，**176 KB/s（≈1.4 Mbps）** |
| magnetic-rf-computing/preview.mp4 前 1.5 MiB | TTFB 1.67s，全程 11.01s，**143 KB/s（≈1.1 Mbps）** |
| people/xiuzhen-guo.webp 223 KB | TTFB 1.16s，全程 2.23s，100 KB/s |
| jsDelivr 镜像同一视频（cdn.jsdelivr.net/gh） | TTFB 9.17s，125 KB/s，无改善 |
| cdn.statically.io 镜像 | 连接失败（21s 超时，不可达） |
| 国内基线 registry.npmmirror.com 1.5 MiB | TTFB 0.56s，**4.26 MB/s** |

站点解析到 GitHub Pages anycast（185.199.108–110.153，Fastly）。本机到国内源 4.26 MB/s（约 34 Mbps），排除本地宽带问题；**瓶颈是本机到 GitHub Pages 的跨境链路，实测仅约 1.1–1.4 Mbps**。

## 视频码率与可用带宽对照

preview.mp4 全部为 720p H.264、faststart（ffmpeg 逐个解析）：

| 预览 | 大小 | 时长 | 总码率 | 1.2–1.4 Mbps 链路下 |
| --- | ---: | ---: | ---: | --- |
| magnetic-rf-computing | 11.66 MiB | 41.5s | 2359 kb/s | 需 2.4 Mbps，**永远播不完，持续缓冲** |
| cardiac-monitoring | 6.22 MiB | 35.1s | 1488 kb/s | 超出带宽，反复卡顿 |
| mechanical-metasurface | 11.95 MiB | 78.7s | 1275 kb/s | 临界偏上，易卡 |
| mmprism-sign-language | 5.98 MiB | 51.6s | 972 kb/s | 临界 |
| mighty-drone-backscatter | 8.83 MiB | 102.3s | 724 kb/s | 勉强可播 |
| eeg-fatigue-interaction | 2.86 MiB | 34.1s | 705 kb/s | 可播 |
| mmexpert | 3.75 MiB | 71.5s | 440 kb/s | 可播 |

Research 页按 `research.json` 顺序首屏方向一的前两段视频正是 magnetic-rf（2359 kb/s）与 mechanical-metasurface（1275 kb/s），且现有 `research-video.ts` 以 200px 提前量加载，两段**同时**抢占同一条 ~1.4 Mbps 链路，各分得约 0.6–0.7 Mbps。magnetic-rf 播放速率是到货速率的 3 倍以上，缓冲永远追不上——与"展示视频一直无法完整加载"现象完全吻合。

## 图片侧

- Home 词云已做多尺寸 WebP（110–443 KB），机制正确；在 100–176 KB/s 链路下每张仍需 0.6–4.5s，属链路问题而非实现问题。词云当前为无损编码，是用户此前确认的保真选择。
- People 16 张照片为长边 ≤960 的 WebP（最大 218 KB，合计约 1.29 MB），已有 `loading="lazy"`；卡片显示宽度远小于 960px，存在 2–4 倍冗余，次要优化点。
- 页面本身为静态 Astro，HTML 61.7 KB、TTFB 约 1.1s，结构无问题。

## 结论（按影响排序）

1. **主因：跨境链路带宽**。GitHub Pages（Fastly）从本网络实测仅 1.1–1.4 Mbps，而国内源同机 4.26 MB/s。站内任何优化都无法提高管道本身；无自定义域名（用户已取消购买）就无法套国内 CDN 或 Cloudflare，公共镜像（jsDelivr/Statically）实测无改善或不可达。**可行方向是把单个资源的需求压到链路预算内。**
2. **次因：预览码率超出链路预算**。7 段中 4 段 ≥ 约 1 Mbps，最重的两段恰是 Research 首屏前两段。
3. **加重因素：首屏两段视频并发加载**，平分本已不足的带宽。
4. 更正（2026-09-22 实施时发现）：七段预览自 09-18/09-22 各批起就带有 poster.jpg 并在线上生效，初稿"视频无 poster 帧"为诊断时检索疏漏；poster 项无需实施。

## 优化建议（未实施）

P0（直接对症，纯本地改动，不涉及主机/域名）：
- 将超预算预览重编码至 ≤800 kb/s（magnetic-rf、cardiac、mechanical-metasurface、mmprism；可配合降到 540p，卡片显示宽度下感知差异小）。目标：预览总量约 51 MiB→约 30 MiB，全部视频在实测链路下 1–3s 起播且不再中断；Demo 与 ZIP 保持原质量不动。
- 首屏避免两段并发：缩小提前量（如 200px→50px）或一次只让一段进入缓冲。
- poster 帧已于 09-18 起就位（见上方更正），本项无需实施。

P1（次级）：
- 静音自动播放的 preview 去掉音轨（Demo 保留声音），省 2–193 kb/s。
- People 照片按显示宽度的 2 倍重做（长边 ≤480px），总量约再减一半。
- 词云改有损 q85 或限制最大宽度可再省 60%+，但与此前"无损保真"决定冲突，需用户拍板。

P2（链路，需用户决策，当前约束下基本不可行）：
- 国内 CDN 需备案域名（用户已取消域名）；免费海外托管同为跨境。维持 GitHub Pages + 压缩媒体是当前约束下的现实解。

预期效果：P0 后所有预览码率 ≤0.8 Mbps < 实测 1.2 Mbps 链路，Research 各段可流畅播完；图片端 P1 后 People 页总传输约 0.6 MB。整体"完整加载"仍受跨境链路上限约束，但访客可感知的中断和空白将基本消除。

## 交付状态

诊断脚本 `.tools/media-perf-diag.mjs`（码率/尺寸统计，.tools 已被 git 忽略）。本文档与 progress/README 更新为本地 Git 提交，未 push。下一步：用户确认优化范围（尤其 P0 是否执行、词云是否改有损）后实施；发布另需明确请求。
