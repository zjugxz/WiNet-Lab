# Publications 本地录入验证

日期：2026-09-18（Asia/Shanghai）。状态：本地实现及技术验证完成，等待用户查看；没有上传GitHub或修改线上网站。

## 范围与资料处理

用户要求先把全部75条录入本地网站，因此4条缺少正式出版证据的记录不再阻塞录入。数据完整保留原清单75条及其原引用：41条期刊/文章、32条会议论文、1条Poster、1本专著。71条采用上一轮出版核验书目与链接；p03/p34/p37/p71使用原资料、无虚构Paper链接、显示Details pending。没有改动DOCX或Word锁文件。

采用正式卷期年/会议年排序，同年按原清单顺序。用户的新指示允许录入，但不记作逐条接受核验建议或页面验收。两条中文引用保留原文及lang标记；p37引号保留原始形态等待后续确认。未系统核验的通讯作者、荣誉、分类和影响因子保留于原引用，不作为已确认标签展示。

数据位于src/data/publications.json，页面为src/pages/publications.astro，条目组件为PublicationCard.astro，类型/校验/排序及书目格式位于src/lib/publications.ts。动态占位路由已排除publications，仍产生共5页。没有实现本地内容管理工具或在线CMS。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| 类型检查 | 24个文件，0错误、0警告、0提示。 |
| 根路径构建 | 5页成功，Publications只有一个生成路由。 |
| 内容与来源 | 75个唯一ID，与核验文件的75条原引用逐字一致；71条题名、作者顺序、年份及URL逐条一致。浏览器检查所有75条标题和完整作者顺序，71个资源入口、4个待核验标记。 |
| 重要修正 | 检查Mighty归2025、mmWave综述2052–2087页、HeadFi II为Poster且含Xiaoran Fan；会议/期刊WiZig都可检索，未去重。 |
| 筛选 | 年份/类型同组OR、跨组及关键词AND；多选、中文/作者/大小写/空白搜索、无结果、清除和Enter操作通过。 |
| 键盘及可访问性 | 空状态清除后焦点回搜索框；手机筛选面板键盘展开正常；320及1440px的WCAG A/AA自动检查无违规。自动检查不等于全面人工无障碍认证。 |
| 无JavaScript | 75条和所有已有论文链接仍可用，不显示无法工作的筛选控件。 |
| 响应式 | 320/390/768/1440px无横向溢出；手机筛选在列表前并默认折叠，桌面位于列表右侧。 |
| Home回归 | 原有9项测试通过，包含菜单固定坐标重复点击、键盘焦点、导航、词云/News及响应式。导航测试更新为Publications已有内容，另三页仍明确占位。 |
| 仓库子路径 | /WiNet-Lab/独立构建通过；5页、样式、词云、75条列表、筛选、出版链接及手机菜单正常，无失败请求。 |
| 截图 | 桌面、390px手机、手机展开筛选和Book筛选截图已目视核对，无遮挡/溢出。 |

本轮Home 9项和Publications 8项均得到通过结果。初次执行因未设置本项目浏览器缓存路径而未启动浏览器，设置PLAYWRIGHT_BROWSERS_PATH后恢复。实际测试发现原生Clear all按钮的reset默认行为晚于微任务，改为在下一任务更新结果；之后筛选测试通过。手机按钮展开后名称变为Hide filters，修正测试定位器后320/390px两项定向复测通过。未把环境错误或失败用例记作成功。

## 可复现命令

本机使用项目内Node；以下命令在项目目录运行。应先完成根路径构建再运行浏览器测试。

```powershell
$env:Path = (Resolve-Path '.tools/node-v24.21.0-win-x64').Path + ';' + $env:Path
$env:PLAYWRIGHT_BROWSERS_PATH = (Resolve-Path '.tools/browsers').Path
node node_modules/astro/bin/astro.mjs check
node node_modules/astro/bin/astro.mjs build
node node_modules/@playwright/test/cli.js test --workers=4
$env:SITE_BASE = '/WiNet-Lab/'
node node_modules/astro/bin/astro.mjs build --outDir .tools/base-dist
node scripts/check-base.mjs
Remove-Item Env:SITE_BASE
node scripts/capture-publications.mjs
```

截图脚本使用自有4324端口并在结束时关闭，测试端口4322、子路径验证端口4323也与用户的4321预览分离。

## 截图与交接

- [桌面](publications-desktop.png)
- [手机默认列表](publications-mobile.png)
- [手机展开筛选](publications-mobile-filters.png)
- [Book筛选](publications-book.png)

本地开发预览已启动：http://127.0.0.1:4321/publications/ ，HTTP 200及75个条目再次核对通过。需要重新启动时使用根目录start-preview.cmd。相关文档57个本地链接及代码格式检查通过。按项目规则将本轮代码、验证及维护文档一并本地提交，提交哈希见git log；原DOCX和Word锁文件不加入提交。下一步等待用户查看并反馈页面/内容，补证仍可在后续继续，不自动发布或开展其他页面。
