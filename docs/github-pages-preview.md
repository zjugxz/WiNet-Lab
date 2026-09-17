# 将现有初版发布到 GitHub Pages

更新：2026-09-17（Asia/Shanghai）。目标仓库由用户提供：[zjugxz/WiNet-Lab](https://github.com/zjugxz/WiNet-Lab)。部署配置及当前Home代码已本地提交，origin已关联。仓库API确认公开、默认分支main且Pages已开启。首次推送因本机Git未获授权失败；用户现选择手动上传，后台登录尝试已停止。

## 当前核查

- 本地分支为 main，origin指向目标仓库；home.json 和 index.astro 中的用户修改已保存为f305eea，无需重复提交。
- Astro 使用静态输出，site 已设为 https://zjugxz.github.io；本地默认根路径仍为 /。工作流已新增，构建时传入 SITE_BASE=/WiNet-Lab/。
- 最新验证：类型检查19个文件零错误/警告/提示；根路径5页构建成功；9项Chromium测试通过（5.7秒）；/WiNet-Lab/ 独立构建与浏览器子路径检查通过，5页导航、样式、词云和手机菜单正常，无失败请求。工作流YAML解析无错误/警告，尚未在GitHub执行。
- 2026-09-17使用git ls-remote核对时未返回远程提交；通过Git自带curl读取仓库API确认public、main、size=0、has_pages=true。Pages构建来源及操作者写权限仍待实际推送/部署验证。
- 默认项目站点地址预计为 https://zjugxz.github.io/WiNet-Lab/；最终以成功部署后 Pages 显示的地址为准。它使用独立项目路径，无需修改老师原有个人站点仓库。

## 1. 核对仓库条件

使用对该仓库有管理或维护权限的账号，打开目标仓库。若使用 GitHub Free，请确认仓库为 Public；私有仓库是否可用 Pages 取决于账号方案。若没有 Settings/Pages 访问权限，应由老师操作或给予对应权限。

以下首次推送步骤适用于空仓库，已核查时目标没有远程提交。如果此后新增了 README、LICENSE 或其他提交，先获取并核对远程历史、保留已有内容后再合并；不要使用 force 推送覆盖。

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

部署配置、Home修改均已保存为本地提交，origin已配置。现在只需在PowerShell中执行：

```powershell
Set-Location 'F:\WiNet Website Program'
git status --short
git push -u origin main
```

无需重复remote add或commit。若push提示登录，使用拥有该仓库写权限的GitHub账号完成Git Credential Manager授权；仅登录GitHub网页不一定完成本机Git授权。可在已登录的Firefox中打开工具提供的授权链接，不向聊天发送密码或令牌。

git push 会发送 main 的已提交历史，包括已经纳入版本管理的 docs/ 和截图，不只发送网页源码；本项目 .gitignore 已排除 .env、.tools、node_modules、dist 等本机文件。推送前可用 git ls-files 查看被跟踪的文件。

若推送被拒绝并提示远程已有提交，停止该步并核对远程内容后合并，不强推。若在首次推送后才设置 Pages 来源，可在 Actions 中手动运行此工作流。

## 5. 检查上线结果

进入仓库 Actions，等待 Publish WiNet Lab preview 的 build 和 deploy 均成功；再从 Settings → Pages 或运行结果打开网站。预期地址为 https://zjugxz.github.io/WiNet-Lab/，需要实际打开确认。

检查 Home 的词云、样式、菜单及四个栏目链接。当前仅 Home 有真实内容，Research、Publications、People、Contact 仍是占位页。页脚预览提示和 noindex 可保留用于初版预览；noindex不限制访问，任何知道公开地址的人仍可访问。实际部署后再核验国内外访问效果。

以后更新时提交并推送 main，工作流会重新构建发布。在线内容管理后台仍是后续独立任务。

## 本轮交接

配置提交为a98fce7，Home内容提交为f305eea。推送尝试未通过身份验证，未上传代码；用户现改为手动操作，所有本任务后台登录尝试已停止。下一步由用户完成git push并检查Actions及公开站点；准备完成不等于已上线或已通过用户验收。Publications仍待用户提供清单。
