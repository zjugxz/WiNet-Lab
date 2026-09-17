# 将现有初版发布到 GitHub Pages

更新：2026-09-17（Asia/Shanghai）。目标仓库由用户提供：[zjugxz/WiNet-Lab](https://github.com/zjugxz/WiNet-Lab)。用户随后授权补齐部署配置，现已在本地实现并验证。尚未关联远程、推送代码或启用 Pages。

## 当前核查

- 本地分支为 main，没有配置远程；home.json 和 index.astro 中仍有用户的两份未提交修改，发布当前效果时需要一起提交。
- Astro 使用静态输出，site 已设为 https://zjugxz.github.io；本地默认根路径仍为 /。工作流已新增，构建时传入 SITE_BASE=/WiNet-Lab/。
- 最新验证：类型检查19个文件零错误/警告/提示；根路径5页构建成功；9项Chromium测试通过（5.7秒）；/WiNet-Lab/ 独立构建与浏览器子路径检查通过，5页导航、样式、词云和手机菜单正常，无失败请求。工作流YAML解析无错误/警告，尚未在GitHub执行。
- 本机对 GitHub API 的 TLS 连接及 GitHub Git 连接失败，网页工具也未获取目标仓库，故没有确认仓库是否为空、可见性、默认分支、操作者权限或现有 Pages 设置。URL中的账号和仓库名来自用户提供的链接。
- 默认项目站点地址预计为 https://zjugxz.github.io/WiNet-Lab/；最终以成功部署后 Pages 显示的地址为准。它使用独立项目路径，无需修改老师原有个人站点仓库。

## 1. 核对仓库条件

使用对该仓库有管理或维护权限的账号，打开目标仓库。若使用 GitHub Free，请确认仓库为 Public；私有仓库是否可用 Pages 取决于账号方案。若没有 Settings/Pages 访问权限，应由老师操作或给予对应权限。

以下首次推送步骤适用于空仓库。如果已有 README、LICENSE 或其他提交，先获取并核对远程历史、保留已有内容后再合并；不要使用 force 推送覆盖。本文未核实该仓库为空。

## 2. 已完成的 Astro 与自动部署配置

无需再次手动创建文件：

- [astro.config.mjs](../astro.config.mjs) 已设置 site，并保留环境变量控制 base；默认本地预览从 / 访问。
- [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) 在推送main或手动运行时触发，使用Node 24、锁文件安装依赖，执行 npm run check && npm run build。检查或构建失败则不发布；成功后上传站点产物，后续deploy任务发布到github-pages环境。工作流传入 /WiNet-Lab/，设置所需Pages权限并串行处理部署。
- [scripts/check-base.mjs](../scripts/check-base.mjs) 默认检查 /WiNet-Lab/，支持SITE_BASE覆盖，使用独立的 .tools/base-dist 和4323端口。

动作版本及配置依据2026-09-17读取的 [Astro 官方部署指南](https://docs.astro.build/en/guides/deploy/github/)。保留并上传现有 package-lock.json；不需要上传 node_modules、.tools 或本机 dist。

本机复现子路径验证（项目根目录PowerShell）：

```powershell
$env:PATH = "$PWD\.tools\node-v24.21.0-win-x64;$env:PATH"
$env:PLAYWRIGHT_BROWSERS_PATH = "$PWD\.tools\browsers"
$env:SITE_BASE = '/WiNet-Lab/'
npm.cmd run build -- --outDir .tools/base-dist
node.exe scripts/check-base.mjs
Remove-Item Env:SITE_BASE
```

该检查只访问本地静态预览，不能证明远程仓库权限或GitHub实际部署成功。

## 3. 启用 GitHub Pages

在仓库进入 Settings → Pages → Build and deployment，将 Source 设为 GitHub Actions。这里需要 Astro 的构建流程，不把当前文档 docs/ 目录当作网站输出目录。参见 [GitHub 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 4. 保存当前版本并首次推送

部署配置及相关文档已单独保存为本地提交；用户原有的两份Home修改仍未提交。下列命令先保存这两份内容，再连接远程并推送。本轮未代为执行这些操作：

```powershell
Set-Location 'F:\WiNet Website Program'
git status --short
git add -- src/data/home.json src/pages/index.astro
git diff --cached --stat
git commit -m "content: save current Home preview"
git remote add origin https://github.com/zjugxz/WiNet-Lab.git
git push -u origin main
```

本次已确认本地没有 origin，故使用 remote add；若执行前已配置，则先用 git remote -v 核对，不要重复添加或盲目覆盖。若 commit 提示缺少作者身份，先在本仓库设置 git config user.name 和 git config user.email 为你自己的提交署名和邮箱，再重试提交。若 push 提示登录，使用拥有该仓库写权限的GitHub账号完成验证；不向聊天发送密码或令牌。

git push 会发送 main 的已提交历史，包括已经纳入版本管理的 docs/ 和截图，不只发送网页源码；本项目 .gitignore 已排除 .env、.tools、node_modules、dist 等本机文件。推送前可用 git ls-files 查看被跟踪的文件。

若推送被拒绝并提示远程已有提交，停止该步并核对远程内容后合并，不强推。若在首次推送后才设置 Pages 来源，可在 Actions 中手动运行此工作流。

## 5. 检查上线结果

进入仓库 Actions，等待 Publish WiNet Lab preview 的 build 和 deploy 均成功；再从 Settings → Pages 或运行结果打开网站。预期地址为 https://zjugxz.github.io/WiNet-Lab/，需要实际打开确认。

检查 Home 的词云、样式、菜单及四个栏目链接。当前仅 Home 有真实内容，Research、Publications、People、Contact 仍是占位页。页脚预览提示和 noindex 可保留用于初版预览；noindex不限制访问，任何知道公开地址的人仍可访问。实际部署后再核验国内外访问效果。

以后更新时提交并推送 main，工作流会重新构建发布。在线内容管理后台仍是后续独立任务。

## 本轮交接

发布时点限制已按用户的新指示更新。此前操作指南提交为179e451；用户随后要求实施本地配置，现将配置、检查脚本和同步文档保存为本地提交 `ci: configure GitHub Pages preview deployment`。Home两份原有修改保持原样且未纳入该提交。下一步核对远程仓库、Pages来源及当前内容版本后再推送；尚未执行上传、实际Actions运行或公开站点验证，技术准备完成不等于网站已上线。Publications仍待用户提供清单。
