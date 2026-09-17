# 将现有初版发布到 GitHub Pages

更新：2026-09-17（Asia/Shanghai）。目标仓库由用户提供：[zjugxz/WiNet-Lab](https://github.com/zjugxz/WiNet-Lab)。本文是操作指导，以下配置尚未写入项目，尚未关联远程、推送代码或启用 Pages。

## 当前核查

- 本地分支为 main，没有配置远程；home.json 和 index.astro 中仍有用户的两份未提交修改，发布当前效果时需要一起提交。
- Astro 使用静态输出，尚无 .github/workflows/deploy.yml，配置尚未指定 site；本地默认根路径为 /。
- 2026-09-17 使用 SITE_BASE=/WiNet-Lab/ 独立构建至 .tools/github-preview-dist，5页构建成功。生成首页的导航、样式和词云地址均带 /WiNet-Lab/。这不是远程部署验证，也没有重新运行整套浏览器测试。
- 本机对 GitHub API 的 TLS 连接及 GitHub Git 连接失败，网页工具也未获取目标仓库，故没有确认仓库是否为空、可见性、默认分支、操作者权限或现有 Pages 设置。URL中的账号和仓库名来自用户提供的链接。
- 默认项目站点地址预计为 https://zjugxz.github.io/WiNet-Lab/；最终以成功部署后 Pages 显示的地址为准。它使用独立项目路径，无需修改老师原有个人站点仓库。

## 1. 核对仓库条件

使用对该仓库有管理或维护权限的账号，打开目标仓库。若使用 GitHub Free，请确认仓库为 Public；私有仓库是否可用 Pages 取决于账号方案。若没有 Settings/Pages 访问权限，应由老师操作或给予对应权限。

以下首次推送步骤适用于空仓库。如果已有 README、LICENSE 或其他提交，先获取并核对远程历史、保留已有内容后再合并；不要使用 force 推送覆盖。本文未核实该仓库为空。

## 2. 配置 Astro 与自动部署

将 astro.config.mjs 调整为以下内容。保留环境变量控制 base，使默认本地预览仍从 / 访问，部署工作流中再指定真实仓库路径。

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://zjugxz.github.io',
  output: 'static',
  base: process.env.SITE_BASE || '/',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
```

新建 .github/workflows/deploy.yml：

```yaml
name: Publish WiNet Lab preview

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: winet-lab-pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        with:
          node-version: 24
        env:
          SITE_BASE: /WiNet-Lab/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.publish.outputs.page_url }}
    steps:
      - id: publish
        uses: actions/deploy-pages@v5
```

动作版本及配置依据2026-09-17读取的 [Astro 官方部署指南](https://docs.astro.build/en/guides/deploy/github/)。保留并上传现有 package-lock.json；构建会安装锁定依赖，不需要上传 node_modules、.tools 或本机 dist。

## 3. 启用 GitHub Pages

在仓库进入 Settings → Pages → Build and deployment，将 Source 设为 GitHub Actions。这里需要 Astro 的构建流程，不把当前文档 docs/ 目录当作网站输出目录。参见 [GitHub 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 4. 保存当前版本并首次推送

以下命令由用户在 PowerShell 中执行；本轮未代为执行。先完成前述配置文件，再运行：

```powershell
Set-Location 'F:\WiNet Website Program'
git status --short
git add -- astro.config.mjs .github/workflows/deploy.yml src/data/home.json src/pages/index.astro
git diff --cached --stat
git commit -m "chore: prepare initial GitHub Pages preview"
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

用户已明确提出提前发布现有初版的新目标，替代此前必须等待整站完成再首次上传的时点限制；本轮问题是“应该怎么做”，因此交付操作指导及只读核查，不将其记录为已经上传或网站已经上线。Publications 仍待用户提供清单。文档与项目规则同步保存为本地提交 `docs: explain initial GitHub Pages publication`。
