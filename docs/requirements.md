# 已确认需求

更新日期：2026-09-18（Asia/Shanghai）。

## 网站

- 名称：WiNet Lab，已由用户明确指定；替换网站原有 Winet Group 名称。完整名称为 Wireless Intelligence for Networked and Embodied Things (WiNet) Lab，单位为 Zhejiang University。
- 参考网站：https://marslab.tech/ 。已读取五个栏目的网页内容；实际桌面、手机视觉与交互尚未逐项验证。
- 页面：Home、Research、Publications、People、Contact。
- 用户已确认网站正文全英文。本次开始公共导航、页脚及 Home 首页原型；缺少的真实资料使用明确的英文占位内容。其他四页仅为导航验收保留占位路由，不算完成内页任务。
- 用户同意本地页面实现可先进行，仓库链接及远程核验不是本地开发的前置条件；仍须在部署前核对。
- 页面布局参考该网站；本课题组的具体文案、研究方向、成员、论文、图片和联系信息尚待提供及确认。
- 用户要求网站背景使用纯白（#ffffff），Home 移除 Events 和 Collaborators。参考站仅作布局参考，不需要照搬其全部内容；当前首页保留主视觉、课题组介绍和 News。
- 用户要求页脚上半部分仅居中展示 WiNet Lab 图标及名称，移除“Research. People. Possibilities.”和“Get in touch”跳转；同时设计色彩、图形及字样更丰富的 logo。新方案共用于页眉/页脚，设计效果等待用户确认。
- 用户取消生图流程，要求简约美观、避免复杂元素，并偏好非字母图标。看过回波、感知之眼、跨域连接三个候选后，用户决定“先使用现在的版本”：保留网站现有绿色 W 波形、橙色信号点和两行 WiNet / Lab 字标作为暂用方案。该决定允许暂用现状，不代表最终品牌定稿，也不代表整站验收。停止候选细化及 API/密钥排查，后续用户再提出时才继续 logo 设计。
- 用户已提供三段正式英文 Home 介绍，按原文与段落整合；同时提供词云图用于替换原生成主视觉。原图已取得并核对，保存为 public/images/winet-lab-wordcloud.png（2154×1614），保留完整比例，未重绘或裁剪。
- 用户已提供7条2026年4月至9月的News，要求填充首页并说明加粗编辑位置。News按年月倒序显示，同月保留输入顺序；介绍和新闻正文支持 **加粗** 标记。按全英文要求，将奖项中文括注“国家自然科学基金青B项目”整理为“Category B”，保留用户提供的英文奖项名及第一人称表述。
- 用户现明确要求开展 Publications，参考 https://marslab.tech/publications/ 的页面实现；论文来源由用户自行提供，不自动导入老师主页或参考站论文。2026-09-18已收到并完整读取docs/文章列表.docx，共75条成果（74条论文/文章和1本专著）。用户追加要求通过Google Scholar逐条确认，已逐项比对并结合出版记录核验：71条匹配（32条需修正或重点补充）、4条证据不足。修正建议及正式卷期年/在线年分离口径待用户审阅，详见publications.md及verification/publications-audit-2026-09-18.md。参考站布局/筛选已核对，页面仍是占位路由，核验完成不等于网页实现或用户验收。
- 已确认使用在线内容管理后台，访问体验兼顾中国大陆与国际访客。
- 2026-09-18用户要求“先把这75条录入本地网站”，不再以4条补证作为录入前置条件。本地Publications已实现；71条使用核验书目和正式卷期年，4条沿用原资料并标记Details pending，所有原引用保留。页面提供年份/类型/关键词筛选、数量及空状态；中文原题保留，不编造官方译名。未提供的图片/主题/Featured不自动补造，未经核验的荣誉指标不作为已确认标签展示。录入授权不等于逐项认可核验结论，页面与年份口径等待用户查看确认；本轮不上传。
- 用户已明确不需要本地内容管理工具；当前优先将现有资料整合为五页网站初版，随后直接实现最终在线管理后台。资料仍与页面组件分离，方便同一内容源接入后台。
- 2026-09-18后续指示：针对上述4条检索信息不完整的记录，以用户提供文档作为展示依据，去掉Details pending，不再要求补证后才能正常展示。左侧期刊/会议名称参考MARS Lab采用更有艺术感的字体与颜色；默认完整列表的年份分隔须更明显。内部检索证据保留，不把用户指定展示依据写成已获得独立出版核验；本次不改动其他71条已录入书目，不据此记录整页已验收。
- 共享组件、独立页面、统一内容数据源；日常内容修改不应要求深入编辑代码。
- 2026-09-18用户提供P37的CCF官方文章页，阅读核对后明确要求更新网站：使用官方题名《关于“射频计算”的思考》并补入该页作为出版入口；卷号和页码仍保留用户文档资料，原始引用留存。此指示授权本地内容更新，不等于新的GitHub发布授权。
- 2026-09-18用户明确开展Contact，提供合作欢迎文字、博士/硕士招生语句和公开联系邮箱guoxz@zju.edu.cn。保留原文字句，换行整理为合作介绍和Join Us两节，邮箱使用mailto链接。参考MARS Lab的简洁文字排版，不导入参考站申请条件、奖学金、地址等资料。此指示授权本页本地实现，不自动记录Publications已验收，不授权push。

## 协作与交付

最新Cite指示（2026-09-18）：用户纠正引用入口应叫Cite，要求Bib和Text等多种方式，并允许查询对应论文网页搜集资料。Research现有3篇已发表论文提供默认Text、BibTeX、RIS格式切换、复制与下载，文本按Cell/IEEE样式整理，提供出版页入口。此要求覆盖上一轮仅BibTeX的界面范围；投稿文献无引用入口，不自动发布新功能。

最新Bib指示（2026-09-18）：已录用paper增加方便访客引用的Bib组件，参考对应出版机构引用规范。本轮应用于Research已有3篇已发表论文，提供查看、复制、下载BibTeX，按出版记录核对作者、刊会、正式出版年、卷期/文章号/页码及DOI；缺失卷期不推测。投稿卡片不提供Bib，不自动填投稿刊会或恢复PDF。此为发布完成后的新功能任务，本地实现并验证，不延用上一轮上传授权自动push。

最新发布授权（2026-09-18）：用户要求“更新项目文档，完成后将本地代码上传到github对应仓库”，明确授权当前网站及文档上传zjugxz/WiNet-Lab的main并触发既有Pages部署。继续遵守未录用PDF不公开、resources不上传的要求；采用基于远程main的当前文件干净快照，只上传该发布历史，原开发历史留本地备份，不强推或覆盖远程提交。此授权替代先前各本地任务“不push”的限制，但不代表整站验收，也不授权新功能或CMS实施。

最新Research卡片指示（2026-09-18）：每方向按完整Demo是否可用稳定排序，有Demo的排前、没有的排后，不再显示Demo coming soon。没有PDF下载的论文显示不可点击的Paper coming soon，表示仍在投稿流程；继续保持受限PDF文件不公开。刊会名称及年份在标题上方采用参考MARS的暖棕色衬线视觉。用户随后明确：所有Paper coming soon论文先不填写投稿期刊/会议或年份，但保留字段接口，录用后方便修改；因此仅已发表3篇填入刊会/年份，投稿中的3篇留空。该要求替代上一轮“完全隐藏Paper控件”的表现形式，不恢复下载、不授权发布。

最新PDF开放指示（2026-09-18）：用户明确以下四篇尚未录用、不得提供PDF下载：Acoustic-Electromagnetic Information Sensing and Security Protection via Intelligent Transparency Metasurfaces；Event-based Visible Light Backscatter Communication System in Underwater Environment；A low-power single-channel EEG sensor for fatigue monitoring and command interaction；A magneto-mechanical bio-interface with ultra-low-power analog backscatter for inclusive cardiac monitoring。已录入的后三篇隐藏Paper并移除公开文件；第一篇当前未找到，不猜测其对应其他论文。预览和Demo保留，原稿留在本地resources。恢复PDF须用户另行明确授权，不能仅因补充资料自动恢复。此请求不授权push或重写Git历史。

最新Research资料指示（2026-09-18）：按重构后的resources目录导入全部资料。paper/display/demo中的方向目录决定归类：Bits Meet Physics及Wireless without Batteries各3篇；第三方向未提供资料，保留占位。标题以PDF正文为准，简介根据摘要整理；使用用户提供的展示视频/图片，完整Demo有多份时打包ZIP。缺完整Demo不制造下载入口。保留静音自动循环、桌面双列、手机单列及Paper/Demo图标，不恢复媒体说明。仅本地实现，不自动修改Publications或push。

最新Research展示指示（2026-09-18）：移除“EEG-based fatigue monitoring during cognitive tasks. Download Demo for all three full-length videos (ZIP).”说明行，后续卡片同样不显示媒体说明。PDF下载按钮统一改名Paper；Paper使用简单文档图标，Demo使用带播放三角的视频图标，保留现有小尺寸和下载行为。对应video description字段不再需要；视频仍由论文标题提供可访问名称，独立字幕轨能力保留。仅本地修改，不push。

最新Research排版指示（2026-09-18）：展示Demo应自动循环播放，无需点击；同一方向桌面每行显示两项研究，参考MARS Lab，PDF和Demo下载按钮更小。实现静音自动循环/行内播放，保留原生暂停控件；卡片改为媒体在上、文字在下的双列网格，手机单列，下载按钮高度30px。当前一篇论文占左列，不补造第二项。本地修改，不授权push。

最新Research录入指示（2026-09-18）：用户指定将resources目录（消息拼作resouorces）中A low-power single-channel EEG sensor for fatigue monitoring and command interaction的PDF、完整Demo文件夹和display短视频填入组件，明确归属Wireless without Batteries。使用PDF正文题名与摘要整理简介；完整Demo含三个MP4，打包为一个ZIP下载，display视频独立用于预览。不自行录入其他研究，不因用户指定方向而将使用电池的原型描述为无电池设备。本轮仍仅本地更新，不上传。

最新Research组件指示（2026-09-18）：每篇论文展示一段简短Demo或者论文图片，提供PDF和Demo按钮下载完整论文和完整Demo。先实现可复用组件及每方向多篇论文的数据接口；预览媒体与完整下载文件分别配置。真实材料待用户提供，未配置的资源明确显示不可用，不能生成假下载链接。此指示延续Research实现，不代表前一版已验收，不授权发布。

最新Research指示（2026-09-18）：用户要求参考MARS Lab的Research格式，先实现整体框架，具体文章和图片后续提供。三个方向依次为Bits Meet Physics（Smart and Programmable Wireless Systems）、Wireless without Batteries（Connecting Devices without Batteries）、Embodied Intelligence of Things（Robots, Human Motion, and Physical-World Sensing）。括号内文字单独作为副标题；实现方向索引、编号分区和明确的图文占位，不自行编造研究项目或归类已有论文。本轮仅本地实现，不授权上传或记为其他页面已验收。

最新删除指示（2026-09-18）：用户明确删除原第71条CWSN 2021的Location Tracking over a LoRa Backscattering Channel；仅从网站内容源移除p71，保留其他稳定编号及原资料/审计历史。现展示74条，2021年5条，会议31条；资源入口仍73。此要求不授权上传GitHub。

最新内容指示（2026-09-18）：用户明确将原第34条替换为郭秀珍、何源《跨技术通信研究》，《计算机研究与发展》2023，60(1):191–205。采用上一轮已核对的期刊正式书目及DOI链接，保持75条总数及稳定id，原文引用保留追溯。本轮仅本地替换，不发布。

- 遵循根目录 `AGENTS.md` 中六条用户原则。
- 每个子任务验证后等待用户验收，再进入下一子任务。
- 使用本地 Git。用户于2026-09-17提出将现有初版提前发布到 zjugxz/WiNet-Lab，新指示替代此前整体验收后才首次上传的时点限制。部署配置已实现并验证；用户随后开启Pages并手动上传f943625，Actions发布与线上浏览器验证通过，不代表整站验收。
- 实时维护项目文档，方便后续 agent 接手。

## 托管与账号（2026-09-15 变更）

2026-09-17最新补充：目标仓库 https://github.com/zjugxz/WiNet-Lab 已核实公开，用户已手动上传当前初版；实际网站 https://zjugxz.github.io/WiNet-Lab/ 已发布，Actions的build/deploy及线上浏览器核验通过。详见 [发布步骤](github-pages-preview.md)。下列未提供仓库链接、可见性未定及禁止提前上传等内容是历史状态，以此补充为准。在线后台选型与认证仍未批准，国内外访问质量未作跨地区验证。

- 用户明确取消购买域名，希望使用老师提供的 GitHub 账号实现网站；域名调研与学校持有问题转为历史存档，不再作为当前阻塞项。
- 用户提供的 GitHub 相关邮箱为 `swugxz@163.com`。尚未取得对应 GitHub 用户名或个人主页链接；不得根据邮箱前缀推断用户名，也未验证该邮箱的账号关联。
- 该邮箱不是网站地址，也未获准将其作为 Contact 页的公开联系邮箱。
- 当前评估方向为 GitHub Pages 默认地址；最终地址取决于实际账号、仓库名以及老师是否已有个人站点。
- GitHub 免费方案下的 Pages 使用公开仓库；用户尚未决定仓库可见性。若要求私有源仓库，需要核对账号方案和 Pages 资格。
- 在线内容后台需求继续保留。Pages 只提供静态托管，后台的登录认证、写入内容和自动发布需要额外设计；具体 CMS、认证服务及其费用尚未批准。
- 兼顾国内外访问的要求继续保留，需要后续实际访问测试，不能仅根据使用 GitHub Pages 承诺网络效果。
- 本地开发、逐项验收及整体验收后再上传 GitHub 的要求继续有效。
- 用户随后请求指导新建 GitHub 仓库；允许现在指导用户创建空仓库，但不等于授权上传代码或上线。建议名称为 `winet-group`，实际 Owner、名称及可见性尚待用户反馈验证。
- 用户已报告完成仓库创建；仓库链接尚未提供，实际设置未独立核验，不能据此认定 Pages 已发布或代码已上传。
- 用户随后提供老师个人主页 https://zjugxz.github.io/ ，已只读核验公开仓库 zjugxz/zjugxz.github.io。该个人主页的账号已明确；课题组新建仓库地址及操作者权限仍未确认，不能据此认定课题组仓库就是该个人站点。

## 尚未批准的建议

- 内容维护采用“表单录入 → 草稿 → 预览 → 点击发布 → 自动更新”，具体实现与发布权限待架构任务确定。
- GitHub Pages 托管静态前台，表单 CMS 编辑仓库中的结构化内容，并通过自动构建发布更新；需先确认实际 GitHub 账号与后台认证方式。
