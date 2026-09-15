# WiNet Lab 项目文档

本目录供用户及后续 agent 了解已确认需求、当前进度和证据。文档随任务进展更新。

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

用户已取消购买域名和本地内容管理工具。当前优先整合真实资料完成五页网站初版，之后实现最终在线后台。首批 Home 三段英文介绍与词云图已整合，网站名称统一为 WiNet Lab，等待用户验收；其他四页仍为占位路由。在线后台和发布流程尚未实现，未上传 GitHub。实际仓库信息留待部署前核验。当前状态以 progress.md 顶部为准，域名相关记录仅供历史存档。

最新内容批次：7条News已整合，首页介绍和新闻正文支持成对 `**` 标记加粗。修改位置及保存后的预览步骤见 [内容维护说明](content-maintenance.md)。

最新设计批次：页脚标识居中，删除标语及联系跳转。用户不满意上一版彩色 logo，已授权使用 API 生成一张新 logo，并确认 key 来自 OpenAI 官方平台。本次接口返回 401 / invalid_api_key，尚无新图片，待用户在本机更新有效 key。见 [设计简报、实际提示词和调用记录](logo-design.md)。此前页面技术检查见 [验证记录](verification/F02-brand.md) 和 [页脚预览](verification/footer-logo.png)，不代表设计已验收。
