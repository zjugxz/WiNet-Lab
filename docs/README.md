# WiNet Lab 项目文档

本目录供用户及后续 agent 了解已确认需求、当前进度和证据。文档随任务进展更新。

老师个人主页独立项目：新仓库 `zjugxz/xiuzhen-guo-homepage` 已核验为空且公开；参考站 `marsyang.site` 的 15 个公开页面、桌面/手机导航、招生说明交互与已知缺陷已完成[全量审计](verification/personal-homepage-reference-audit-2026-09-23.md)（2026-09-23）。尚未创建个人主页工程、上传代码或启用 Pages，等待用户确认复刻边界并提供老师真实资料。

最新发布：[首批Alumni资料集成](verification/people-alumni-populated-2026-09-23.md)（2026-09-23）。People页新增Chuchuan Ceng与Kaixuan Xie两张毕业生照片卡片，复用现有固定尺寸悬浮窗及静态详情页；显示差异化英文简介、Shopee算法工程师去向和2026年3月毕业时间，不显示未提供的邮箱/年龄/链接。功能提交`8176c37`已推送main，Actions #18 success；线上People、两条详情路由和照片哈希核验通过。

最新发布：[正文链接与People链接按钮发布](verification/release-text-links-people-2026-09-22.md)（2026-09-22晚）。正文 `[文字](网址)` 下划线链接标记（可组合加粗、http(s) 白名单）上线，首页 "Dr. Xiuzhen Guo" 链到 zjugxz.github.io；People 每人卡片/详情页链接按钮（邮箱点击复制+就地反馈、PI 网站与 Google Scholar 新标签打开），推送 8250e20..8e259c1，Actions success，线上真实浏览器核验通过（剪贴板内容、copied 状态、无跳转、零错误）。

历史发布：[P0媒体优化发布](verification/release-p0-2026-09-22.md)（2026-09-22晚）。诊断确认跨境链路瓶颈（1.1–1.4 Mbps）后，4段超预算预览重编码至540p/≤731 kb/s（七段合计51.3→33.3 MiB），research-video.ts 改为单一活跃缓冲队列，mmprism Demo 分离原字节文件；随并行会话的照片更新一并推送 main（dcbce97..129c0bd，Actions success）。线上已核验：媒体字节数逐一致、受限PDF 404、真实浏览器首段立即起播/同排12s放行/下方未预取。技术发布不等于整站验收；GIF降级后备与P1待用户确认。

历史发布：用户授权后于2026-09-22将16个本地提交推送main（196230f..60ca9cb），Actions 35697405893 success；线上页面/优化媒体/受限404均已核验，证据见[发布记录](verification/release-2026-09-22.md)。上线内容含媒体优化、People全功能、Research第三方向与mmExpert Cite等；技术发布不等于整站验收。16人（PI 1、PhD 8、Master 7）；PI简介默认展示，点击卡片弹出变暗背景的悬浮窗显示简介，无JS时回退静态详情页；中文简介已译英文、PI简介原文保留；照片压缩为WebP并验证两种base；未发布。待决项见[People验证记录](verification/people-2026-09-22.md)。用户查看后反馈加载缓慢，诊断为跨境链路带宽限制叠加预览码率超预算，见[性能诊断](verification/performance-diagnosis-2026-09-22.md)。

最新本地实现：[People页Alumni接口](verification/people-alumni-2026-09-22.md)（2026-09-22）。people.json新增alumni数组（name必填，学位/区间/去向/课题/链接可选），页面新增Alumni分区；空状态显示占位框，资料到达后填数据即自动渲染，无需改代码。两种base与17项测试通过，等待用户资料。

本地待查看批次：[Gallery接口](verification/gallery-2026-09-22.md)、[Publications全条目Cite](verification/publications-cite-2026-09-22.md)（2026-09-22）。73条（除出版状态未核实的p03）提供与Research页完全一致的Cite入口；引用资料经Crossref DOI内容协商及USENIX/CRAD/CCF/EWSN官方网站逐篇取得（18条存档差异逐条甄别，中文两条为GB/T 7714样式），静态导出219个引用文件；新检查脚本、既有17项测试与Research/子路径回归全部通过，4321预览实测正常。等待用户查看，尚未发布。

历史本地批次：[Home图片与Research视频优化](verification/media-optimization-2026-09-18.md)及其[P0带宽实施](verification/research-video-p0-2026-09-22.md)（后者已随2026-09-22晚发布上线）。首页使用多尺寸无损WebP；预览视频压缩并按视口加载/播放，保留手动暂停和完整Demo原质量。[前期诊断](verification/media-performance-2026-09-18.md)保留为历史依据。

网站地址：[WiNet Lab](https://zjugxz.github.io/WiNet-Lab/)。用户于2026-09-18明确要求更新文档后上传当前本地网站，已上传发布提交918672b，Actions构建/部署及线上关键页面检查通过，具体证据见[发布记录](verification/release-2026-09-18.md)。此前线上版本为f943625；技术验证或发布均不等于用户完成整站验收。

当前内容：Home正式介绍、词云及7条News；Research三方向及6篇研究；Publications 74条记录、73个出版入口；Contact合作/招生文字和邮箱。People与Research第三方向仍为占位，在线后台未实现。

最新功能：[Research Cite多格式引用](verification/research-cite-2026-09-18.md)已随1b225ec发布，Actions成功；线上三篇×三格式的查看、复制、下载均验证通过，投稿论文无入口。具体部署及验证结果见[Cite发布记录](verification/release-cite-2026-09-18.md)。此前仅Bib和本地阶段记录保留作为历史。

Research每方向有Demo优先，无Demo不显示按钮；受限论文显示不可点击的Paper coming soon，PDF不在公开目录。已发表3篇显示暖棕色衬线刊会名称及年份；投稿3篇不填刊会/年份，仅保留接口。上传使用基于远程既有历史的干净快照，不把曾包含受限PDF的本地开发历史上传；原历史仅保留在本地备份分支，原稿留在Git忽略的resources中。

[Contact实现与验证](verification/contact-2026-09-18.md)已完成合作介绍、Join Us招生说明和guoxz@zju.edu.cn邮箱入口，已纳入本次发布范围，尚未记为用户验收。

[Publications](publications.md)当前展示74条、73个出版入口；P71已删除，编号不重排；P34替换为《跨技术通信研究》，P37题名/CCF入口已更新。页面无Details pending，刊会彩色衬线、年份分隔加强。已纳入本次发布范围，尚未记为整页验收。

历史修复：[Home手机菜单修复（2026-09-15）](verification/Home-review-2026-09-15.md)解决展开后按钮上移；当前发布前17项Home/导航/Publications测试通过，Research另有下载和组件检查。历史验证页中的占位状态不代表当前页面状态。

## 阅读顺序

1. [协作规则](../AGENTS.md)
2. [已确认需求](requirements.md)
3. [当前进度](progress.md)
4. [GitHub 托管可行性与待确认项](github-hosting.md)
5. [架构与实现边界](architecture.md)
6. [内容维护与在线工具方案](content-maintenance.md)
7. [F01 验证记录与截图](verification/F01.md)
8. [F02 首批资料整合验证](verification/F02-home.md)
9. [域名调研存档（已取消购买）](domain-research.md)

用户已取消购买域名和本地内容管理工具。使用现有GitHub Pages项目地址；在线后台待后续单独实施。当前状态以progress.md顶部为准，域名调研及旧轮次“不上传”记录仅说明当时范围，不覆盖本轮明确发布授权。

最新内容批次：7条News已整合，首页介绍和新闻正文支持成对 `**` 标记加粗。修改位置及保存后的预览步骤见 [内容维护说明](content-maintenance.md)。

最新设计决定：用户不采用 A/B/C 三个候选，要求“先使用现在的版本”。网站保留现有绿色 W 波形、橙色信号点与两行 WiNet / Lab 字标，作为用户确认的暂用方案；不是最终品牌定稿。见 [设计说明](logo-design.md) 与 [现用 logo](verification/logo-preview.png)。候选图及 API 尝试归档，暂停 logo 探索，不再等待选图或排查密钥。
