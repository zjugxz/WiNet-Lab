# WiNet Lab 项目文档

本目录供用户及后续 agent 了解已确认需求、当前进度和证据。文档随任务进展更新。

网站地址：[WiNet Lab](https://zjugxz.github.io/WiNet-Lab/)。用户于2026-09-18明确要求更新文档后上传当前本地网站，已上传发布提交918672b，Actions构建/部署及线上关键页面检查通过，具体证据见[发布记录](verification/release-2026-09-18.md)。此前线上版本为f943625；技术验证或发布均不等于用户完成整站验收。

当前内容：Home正式介绍、词云及7条News；Research三方向及6篇研究；Publications 74条记录、73个出版入口；Contact合作/招生文字和邮箱。People与Research第三方向仍为占位，在线后台未实现。

最新本地功能：[Research Bib引用组件](verification/research-bib-2026-09-18.md)，已发表3篇可查看、复制及下载核对后的BibTeX；投稿论文无入口。该功能在上述发布之后实现，尚未上传，等待用户查看。

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
