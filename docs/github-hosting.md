# GitHub 托管可行性

核查日期：2026-09-15（Asia/Shanghai）。本文记录可行性和待确认项，不代表完整实施方案已通过用户验收。

## 已确认方向

用户取消购买域名，拟使用老师的 GitHub 账号提供网站。五个页面、在线内容后台及原有工程要求保留。

邮箱仅是用户提供的账号相关信息，不能据此认定 GitHub 用户名、账号归属或访问权限，也不能据此生成真实网站地址。

## 网站地址和前台功能

- 用户/组织站点默认地址为 `https://<owner>.github.io/`，仓库名须为 `<owner>.github.io`；每个账号最多一个该类站点。
- 项目站点默认地址为 `https://<owner>.github.io/<repositoryname>/`。取得账号后，应先确认老师是否已有个人网站；已有时可考虑单独项目站点，不覆盖现有内容。
- Home、Research、Publications、People、Contact，以及浏览器端筛选、导航和图片展示，均可通过静态站点实现。
- 项目站点需正确处理仓库子路径下的链接、图片和页面路由；实际仓库名未定，不硬编码。
- GitHub Free 支持公开仓库的 Pages；若源仓库需私有，先核对老师账号方案与 Pages 资格。尚未获得公开源码决定。

## 在线内容维护

可行方向是“表单 CMS 编辑结构化内容 → 更新 GitHub 内容仓库 → 自动构建并部署 Pages”。用户无需日常编辑组件代码。

GitHub Pages 本身只负责静态托管，不能独立运行常驻后端、数据库或需要保密凭证的登录服务。在线后台可以托管静态界面，但安全登录与内容写入需要额外配置。

Decap CMS 可作为候选，其 GitHub backend 支持 GitHub 登录，编辑者需要内容仓库推送权限，常规认证需要外部 OAuth 服务或托管认证。具体产品、认证服务、权限范围、费用和预览方案均尚未确定。用户没有要求切换为本地工具，不能悄悄删去在线后台需求。

## 保留的交付约束

- 先本地实现和验证，每个子任务等待用户确认；整体验收后才上传 GitHub 并正式发布。
- 用户随后请求指导新建仓库：本轮提供由用户操作的空远程仓库创建步骤，不代表已创建成功，也不授权 agent 登录、上传代码或启用 Pages。
- 国内外访问体验需实际测试，不能因网站可部署就声称已经满足该要求。
- 域名购买和学校域名持有者确认已取消，不再阻塞网站设计。

## 下一步所需信息

用户完成创建后提供仓库链接或创建结果截图，以确认实际 Owner、仓库名称、可见性和是否为空。此链接也可提供老师的实际用户名；不再单独要求其重复提供邮箱。不要根据所提供邮箱的前缀推断用户名。

## 新建空仓库指导（用户操作，尚未验证完成）

1. 在老师的 GitHub 账号下打开 https://github.com/new 。Owner 应为老师实际账号用户名，不是邮箱；如果只能选择其他账号，则需要由老师在其账号下创建。
2. Repository name 建议填写 `winet-group`；这是建议名称，尚未验证最终创建结果。Description 可填写 `Website for the Winet Group research lab.`。
3. 若采用 GitHub Free 的 Pages 路线，建议选择 Public；空仓库的名称和描述会公开，未来上传的代码也会公开。用户尚未反馈其实际选择，不得记录为已经同意公开全部本地资料。若要求源码私有，应另行确认账号方案和托管资格。
4. 保持空仓库：不使用模板，Add README 关闭，Add .gitignore 为 No .gitignore，License 为 No license；若出现让 Copilot 初始化项目的输入项，也留空。本地已有 Git 历史，避免远程独立生成初始提交。
5. 点击 Create repository；创建完成后停在空仓库 Quick setup 页面。不要照页面执行 push 或上传代码，也不启用 Pages；整体验收后再开展这些操作。
6. 用户提供实际仓库链接或截图后，只读核对 Owner、名称、可见性及空仓库状态，并等待用户对该子任务的确认再继续。

空仓库创建与代码上传、网站发布是不同动作。本次只指导第一项，后两项依旧受整体验收约束。

## 来源

- GitHub Pages 说明及默认地址：https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Decap CMS GitHub backend：https://decapcms.org/docs/github-backend/
- GitHub 网页新建仓库及已有本地仓库的初始化注意事项：https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
