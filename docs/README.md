# WiNet Lab 项目文档

本目录供用户及后续 agent 了解已确认需求、当前进度和证据。文档随任务进展更新。

当前任务：[GitHub Pages部署配置与发布步骤](github-pages-preview.md)。目标为 zjugxz/WiNet-Lab；本地Astro站点配置和自动部署工作流已补齐，类型检查、9项浏览器测试及 /WiNet-Lab/ 子路径验证通过。尚未上传或启用Pages，远程仓库实时状态尚未核实。

待资料：[Publications 资料与实现准备](publications.md)。用户要求参考 MARS Lab Publications，并已选择自行提供收录论文清单；参考布局与筛选核对完成，等待实际清单后填充，本页仍为占位路由。

最新修复：[Home 检查与手机菜单修复（2026-09-15）](verification/Home-review-2026-09-15.md)。手机菜单展开后按钮上移的问题已修复；类型检查、构建和9项浏览器测试通过，包含320/390/760 px下固定坐标连续点击与焦点框验证。[修复后截图](verification/home-menu-fixed.png)已目视检查，等待用户验收；其他四页仍为占位页。

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

用户已取消购买域名和本地内容管理工具。Home 三段英文介绍、词云及News已整合，其他四页仍为占位路由。用户允许先上线现有初版，本地部署配置已完成；在线后台仍待实现，未上传GitHub。实际仓库信息留待部署前核验。当前状态以 progress.md 顶部为准，域名相关记录仅供历史存档。

最新内容批次：7条News已整合，首页介绍和新闻正文支持成对 `**` 标记加粗。修改位置及保存后的预览步骤见 [内容维护说明](content-maintenance.md)。

最新设计决定：用户不采用 A/B/C 三个候选，要求“先使用现在的版本”。网站保留现有绿色 W 波形、橙色信号点与两行 WiNet / Lab 字标，作为用户确认的暂用方案；不是最终品牌定稿。见 [设计说明](logo-design.md) 与 [现用 logo](verification/logo-preview.png)。候选图及 API 尝试归档，暂停 logo 探索，不再等待选图或排查密钥。
