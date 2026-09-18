# Research框架与验证

更新：2026-09-18（Asia/Shanghai）。当前6篇研究、前两个方向各3篇，第三方向保留占位；静音循环、双列、小号图标按钮、Demo优先、投稿Paper coming soon及刊会样式已实现并发布，见[发布记录](verification/release-2026-09-18.md)。最新Bib组件为本地新增，尚未上传。以下每轮验证保留当时状态；发布不等于用户验收。

## 最新：已录用论文Bib引用

已发表3篇新增与Paper/Demo并列的Bib按钮，可打开弹窗查看、复制及下载BibTeX。按ScienceDirect/IEEE支持的格式及出版方登记书目整理；Device缺卷期则省略，Mighty使用正式年2025。投稿中的3篇与空方向占位不生成Bib入口或文件。源文件位于src/data/citations，research.json通过bibtex字段关联；展示/复制/静态下载共用同一份数据。支持键盘、手机、复制拒绝回退及无JS直接下载，不恢复未录用PDF。来源、维护和验证详见[Bib组件记录](verification/research-bib-2026-09-18.md)。本轮本地提交、不自动发布，等待用户查看。

## 最新：排序、Paper coming soon与刊会信息

每个方向渲染时按完整demo是否存在稳定排序，有Demo在前，无Demo在后，组内保持原数据顺序；不移动论文所属方向、不修改源数组。无Demo不显示入口，也不显示Demo coming soon。所有未提供PDF的卡片显示不可点击的Paper coming soon；pdf:null仍代表明确不开放，title提示manuscript in submission，受限PDF文件仍不在public或构建输出中。

新增可选publication字段，包含venue、year与status（published/submitted）。当前Device 2026、Cell Reports Physical Science 2026、IEEE Transactions on Mobile Computing 2025采用已核对书目；Mighty使用正式卷期年2025。用户补充明确投稿中的论文不填写刊会或年份，因此三篇仅保留status:submitted，不显示刊会行；后续录用时可以补字段。展示位置参考MARS Research，在图片下、标题上；刊会为18px Georgia粗斜体、#a45122暖棕色，年份为13px衬线加粗，长名称自然换行。此为数据接口，不是在线后台或HTTP接口。

两种base的排序、缺失资源状态、样式、8项下载及受限PDF404均通过，组件自动播放/循环与无障碍检查通过，实际1440/390px预览目视通过。详见[本轮验证与维护](verification/research-card-metadata-2026-09-18.md)。以下记录保留历史状态，以本节为准。

## 历史：未录用论文不开放PDF

水下通信、EEG及心脏监测设为`pdf: null`，公共卡片完全隐藏其Paper控件，不显示Coming soon，也不留下href。同步移除public下对应paper.pdf，使已知原地址在开发预览、根路径及/WiNet-Lab/构建中返回404。保留6张卡片、5视频/1图片及5项Demo；目前只有3份Paper开放。用户列出的Acoustic-Electromagnetic Information Sensing and Security Protection via Intelligent Transparency Metasurfaces当前未录入网站；本轮期间resources新增其展示及完整Demo视频，但没有PDF，无可用下载入口，后续录入须继续屏蔽PDF。

resources原稿保留并加入Git忽略。原稿恢复可从该目录获取，但开放须用户新授权；不要直接恢复整个历史资料清单。本地旧Git提交仍有PDF，本轮不改写历史或push；公开仓库发布前须处理历史泄露渠道。详见[访问检查与边界](verification/research-withheld-pdfs-2026-09-18.md)。以下资料导入记录描述当时状态。

## 历史：全部资料导入

已核对6篇PDF题名/摘要及22份源文件，填入5段展示视频、1张水下通信系统图、6份Paper及5项完整Demo下载。EEG和心脏监测的Demo分别包含3段和4段原视频；其余3项直接下载原MP4。超表面和Mighty的display/demo源文件哈希相同，明确配置为共用同一网站文件；磁场/RF原视频为HEVC，下载保留原文件，展示另生成H.264/AAC兼容版本。水下通信未提供完整Demo，按钮保持禁用。

标题使用PDF正文（磁场/RF论文以Physical computing开头），简介据摘要整理，不推断稿件刊期或把使用电池的设备描述为无电池。没有修改Publications。完整映射、哈希及验证范围见[本轮记录](verification/research-resources-2026-09-18.md)。以下首次录入与组件实现记录保留当时状态。

## 最新：移除媒体说明并区分下载图标

用户明确要求当前及未来卡片都不显示媒体下方说明行。公共组件已移除figcaption及关联样式/aria-describedby，视频description字段从数据schema、EEG记录和测试样例中删除。视频保留基于论文标题的可访问名称，图片alt及独立字幕轨不受影响。下载文案统一为Paper和Demo，分别使用14px折角文档SVG和带播放三角的视频框SVG；缺资源的禁用按钮也显示相应图标。内部文件字段仍为pdf/demo，原文件与下载行为不变。

验证：类型检查31文件零错误/警告/提示，正常构建5页；既有组件脚本在两种base下通过自动循环、双列/手机布局、Paper与Demo真实下载字节、按钮尺寸及自动无障碍检查。实际开发预览确认无媒体说明节点和原说明文字，Paper/Demo图标各不相同、按钮仍30px，截图目视通过。已本地提交、未上传；等待用户查看。

## 自动循环预览与双列卡片

按用户指示，展示视频使用`autoplay muted loop playsinline`，不需要点击即可静音循环。保留原生控件供暂停/恢复，`preload`改为metadata；浏览器仍可能按用户省电或自动播放设置限制播放，此时可使用原生控件。无新增播放器脚本，原视频和完整版下载文件未改动。

每个研究方向在宽度大于760px时使用两列网格，每张卡片上方为媒体、下方为标题/简介/下载入口；760px及以下单列。PDF/Demo按钮由44px缩至30px高，12px文字、14px图标。当前只有一篇真实研究，占左侧一格；第二篇加入同方向papers数组后自然排在右侧，不创建虚构第二篇。

验证：Astro检查31文件零错误/警告/提示，正常构建5页；既有组件脚本在`/`和`/WiNet-Lab/`均通过无交互自动静音播放、时间回绕循环、键盘暂停/恢复、两个卡片同排和第三个换行、320/390px单列与768/1440px双列、紧凑按钮及真实下载字节核对、WCAG 2 A/AA自动检查。测试关闭Playwright的免手势自动播放放宽参数，且在任何点击/按键前核对自动播放。

实际4321页面初次检查仍使用旧组件CSS；确认本项目进程后重启，刷新后验证按钮30px、1440px下两列各542px、卡片内部纵排，未点击视频即播放至11.6秒；390px全页截图目视通过、无横向溢出、保持静音播放。已恢复临时视口。原论文数据与下载资源不变，本地提交、未push；等待用户查看。

## 录入首篇EEG研究

用户明确指定论文A low-power single-channel EEG sensor for fatigue monitoring and command interaction属于Wireless without Batteries，并授权读取resources/paper、demo和display中的对应资料。已核对22页PDF的首页正文题名与摘要，整理一段英文简介；display/1.mp4作为预览，截取第15秒作为封面；Demo按钮下载包含完整文件夹三个原MP4的ZIP，PDF按钮下载原论文。源文件保持不变，不补造期刊/年份，不更改Publications。摘要说明原型使用270mAh电池，方向分类按用户指示，简介只描述低功耗反向散射，不将其声称为无电池原型。

根路径和子路径媒体播放、键盘下载、文件一致性、ZIP完整性以及手机/桌面检查均通过。详见[本次资料映射与验证](verification/research-eeg-2026-09-18.md)。

## 论文预览与下载组件

用户要求每篇论文展示图片或简短Demo，并通过Paper、Demo按钮下载全文和完整演示。`ResearchPaperCard.astro`统一使用上方媒体、下方标题/可选引用/简介/下载按钮，不显示媒体说明行；分区控制桌面双列与手机单列。图片保持完整比例；视频静音自动循环播放，保留原生控制、可选封面和字幕，preload为metadata。短视频路径和完整Demo下载路径独立。

每个方向通过`papers`数组添加任意数量的论文卡片，目前前两个方向各有3篇研究，第三方向为空并显示占位卡片。有Demo优先显示；缺Demo不显示按钮，缺PDF显示禁用Paper coming soon。显式`pdf: null`表示不开放，同时必须移除公开PDF文件。不会使用占位链接。只有核对display和demo原文件完全一致时，才显式配置为共用文件。已有Publications数据未变更。

配置示例（仅说明字段；以下文件与论文尚不存在，不直接粘入正式数据）：

```json
{
  "id": "paper-slug",
  "title": "Supplied paper title",
  "summary": "Supplied short introduction.",
  "citation": "Supplied venue and year",
  "preview": {
    "type": "image",
    "src": "research/images/paper-slug.png",
    "alt": "Description of the paper figure"
  },
  "pdf": { "src": "research/downloads/paper-slug.pdf" },
  "demo": { "src": "research/downloads/paper-slug-full.mp4" }
}
```

视频预览将`preview`替换为：

```json
{
  "type": "video",
  "src": "research/previews/paper-slug-short.mp4",
  "poster": "research/images/paper-slug.png",
  "captions": {
    "src": "research/previews/paper-slug-en.vtt",
    "language": "en",
    "label": "English"
  }
}
```

封面、字幕及引用行可省略；有语音的演示应提供字幕。图片必须提供alt，视频不再需要description字段，也不显示额外说明行。所有文件先放入`public/`，数据中的src不写public前缀、域名、开头斜杠或部署子路径；组件统一编码文件名并添加base。下载可选`filename`用于指定保存名称。使用同源文件及原生download属性；外部托管链接、在线视频嵌入及后台上传不在本次实现范围内。

`src/lib/research.ts`提供数据类型与构建校验：必填文字、稳定ID及唯一性、媒体类型和相对文件路径。它不验证文件存在性，因此真实资料录入后还须检查媒体与下载文件实际返回正常。

本轮验证：31文件类型检查零错误/警告/提示，正常构建5页，Home/导航9项测试通过。运行`node scripts/check-research-card.mjs`在独立测试构建注入`tests/fixtures/research-card.astro`，根路径与/WiNet-Lab/分别验证图片加载、原生视频播放/字幕、键盘触发的真实下载及精确文件字节、缺资源状态、四种视口无溢出、WCAG 2 A/AA自动扫描零违规。合成视频/PDF/字幕只生成到忽略目录.tools，普通构建没有测试页或测试资源。实际开发页1440/390px全页截图目视通过，320px无溢出；显示三张占位卡片和六个禁用按钮。测试仅证明组件能力，真实资料的浏览器编码兼容性和文件可下载性须在录入后验证。

## 来源与范围

用户要求参考[MARS Lab Research](https://marslab.tech/research/)的格式，并提供以下三个方向。当天已读取参考页并目视查看桌面布局：顶部编号方向索引链接到下方各方向分区，分区包含标题、副标题及项目图文和资源入口。本次借用索引/分区/图文结构，使用WiNet现有公共导航、白色背景和绿色衬线风格。

| 顺序 | 方向 | 副标题 |
| --- | --- | --- |
| 01 | Bits Meet Physics | Smart and Programmable Wireless Systems |
| 02 | Wireless without Batteries | Connecting Devices without Batteries |
| 03 | Embodied Intelligence of Things | Robots, Human Motion, and Physical-World Sensing |

三个副标题保持用户文字，不显示外层括号。每个分区预留图片、研究介绍及相关论文位置，明确显示coming soon。没有导入参考站项目、图片或论文，没有自动归类现有Publications，也没有创建空资源链接。

## 实现与维护

- `src/data/research.json`：独立维护三个稳定id、标题、副标题和papers数组；顺序同时用于索引和分区编号。
- `src/pages/research.astro`：页面与可点击的方向索引，沿用SiteLayout。
- `src/components/ResearchDirection.astro`：复用分区标题，遍历论文卡片，空数组显示一张占位卡片。
- `src/components/ResearchPaperCard.astro`：统一媒体预览、论文简介及独立下载资源的展示。
- `src/pages/[section].astro`：排除Research后只生成People占位页。

索引使用原生片段链接，分区可接收键盘焦点并有可见焦点框。无新增客户端脚本或外部资源。占位不生成失效img/video请求。真实资料收到后可按上述papers字段直接填充；本次未实现后台表单或图片上传能力。

## 历史：首轮框架验证结果

- Astro检查27文件，零错误、警告和提示；根路径及`/WiNet-Lab/`分别构建5页。
- 既有Home/导航9项浏览器测试通过（4.0秒），包括Research三个标题及三个索引入口断言。
- 子路径脚本通过：全站导航、样式、图片、74条Publications及筛选、手机菜单，无失败请求。
- 实际开发预览`http://127.0.0.1:4321/research/`中，1440px桌面与390px手机全页截图目视通过；320/390/768/1440px无横向溢出。
- 三个索引分别通过Enter激活，焦点进入对应id分区；手机点击第二方向后URL片段、焦点和视口定位正确。三个链接均有真实目标，主内容没有失效图片或虚构资源入口。
- 临时浏览器尺寸覆盖已恢复，预览页保留供查看。

首轮框架未改Publications数据或重新执行整套Publications测试，当时没有Research自动无障碍扫描；最新组件测试范围见上文。技术验证不等于用户验收。

## 交付状态

数据、6篇研究的允许公开副本和文档已纳入2026-09-18授权发布。resources原稿保持本地并受Git忽略，三份受限PDF不在发布树及发布历史；旧开发提交仅作本地备份。部署结果见发布记录。下一步等待用户查看效果；新资料、People与在线后台分别按后续指示实施。
