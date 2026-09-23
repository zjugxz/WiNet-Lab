# 旧个人主页根地址跳转发布与验证记录

日期：2026-09-23（Asia/Shanghai）

## 范围与授权

用户明确授权修改并部署 `zjugxz/zjugxz.github.io`，目标是让 `https://zjugxz.github.io/` 自动跳转到 `https://zjugxz.github.io/xiuzhen-guo-homepage/`。本次不修改 WiNet Lab 或新个人主页仓库。验收范围包括根地址、旧子路径、桌面/手机、最终URL、刷新及新主页加载。

## 实现

- 旧站默认分支为 `master`，修改前提交为 `9f6644a557de6afc569ef01d0746e98512ce2b6c`。
- 保留旧Jekyll源码及全部Git历史，不建立或发布备份分支。
- 新增 `redirect-site/index.html`、`redirect-site/404.html` 和 `.nojekyll`。
- 两个页面均使用 canonical、零秒meta refresh、JavaScript `location.replace` 和可点击后备链接；JavaScript保留原查询参数及锚点。
- 部署工作流继续写入既有 `gh-pages` 分支，但不再构建旧Jekyll站点，只发布 `redirect-site/` 并清理旧发布产物。
- GitHub Pages为静态托管，此方案是客户端跳转，不是HTTP 301/302。

## 发布证据

- 功能提交：`1b0bebc119c39526b89cc70041b2b6febe24ffdc`（`feat: redirect legacy homepage to new site`）。
- 推送方式：`master` 从 `9f6644a` 普通快进到 `1b0bebc`，无强推、无历史改写。
- [Deploy site #185](https://github.com/zjugxz/zjugxz.github.io/actions/runs/35841529595)：completed/success。
- [GitHub Pages build #148](https://github.com/zjugxz/zjugxz.github.io/actions/runs/35841552164)：completed/success。
- `gh-pages` 部署提交：`cc53edbbb8b2250bc5fa57119cd2366382638dd7`；远程树仅含 `.nojekyll`、`404.html`、`index.html`。

## 验证结果

- 本地：两个HTML文件逐字一致；均包含4处新主页绝对地址、`location.replace`、meta refresh和canonical；Git差异检查无空白错误；两个工作流均可由YAML解析器读取。
- 本地真实Chromium：根路径跳到新主页；模拟旧深层路径跳到新主页并保留 `?source=legacy#publications`。
- 线上源码：根地址和不存在的旧子路径返回内容均包含4处目标地址，不再含旧主页标题标记。
- 线上真实Chromium：1440x900桌面根地址和390x844手机根地址均落到新主页，标题为 `Xiuzhen Guo`，成功轮次无失败请求或HTTP错误。
- 跳转后刷新：地址保持在 `https://zjugxz.github.io/xiuzhen-guo-homepage/`，页面标题仍为 `Xiuzhen Guo`。
- 线上旧路径：`/legacy-check/?source=old#publications` 经自定义404落到 `https://zjugxz.github.io/xiuzhen-guo-homepage/?source=old#publications`。404是进入客户端跳转页的预期响应。
- 测试期间GitHub链路偶发连接重置，重试后通过；成功轮次证明跳转和目标页可用，但不代表所有地区网络质量。

## 回退与状态

旧源码未删除。若需恢复旧主页，可在 `master` 回退功能提交并重新推送，由原工作流历史恢复Jekyll构建。当前技术发布及验证完成，仍等待用户实际访问确认；工具成功不记为用户验收。
