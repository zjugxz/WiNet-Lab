# WiNet Lab logo 设计记录

日期：2026-09-15。当前状态：用户不采用三个候选，确认先保留网站现有 W 波形版本，暂停 logo 探索。

## 当前决定：暂用网站现有版本

用户明确回复“都不太好，先使用现在的版本吧”。当前网站为绿色 W 波形、橙色信号点与深色两行 WiNet / Lab 字标，继续共用于页眉及居中页脚。见 [现用标识](verification/logo-preview.png) 和 [验证记录](verification/F02-brand.md)。这是允许暂用的决定，不是最终品牌定稿；用户此前对非字母图形的偏好保留，待其后续重新提出再设计。

下方三版候选均不采用，保留作历史资料；不要自动细化 A，也不要等待用户再次选图。本轮没有修改网站组件、没有调用生图或读取密钥。

## 历史候选：从研究对象提炼图形（均未采用）

见 [桌面对比图](design/logo-options/comparison.png)、[手机对比图](design/logo-options/comparison-mobile.png) 和 [独立对比页面](design/logo-options/index.html)。这组图形均为本地 SVG 绘制，无生图 API；没有替换网站现有组件。

- A 回波 / Echo：两侧简化回波包围一个菱形器件。以反向散射、低功耗无线和物理器件交互为设计隐喻。推荐作为细化方向，因为它更贴近用户提供的研究主题，且只有三个图形元素。
- B 感知之眼 / Sensing：眼形轮廓与感知中心，强调理解物理世界。容易辨认，但可能使人首先联想到视觉研究，需要用户判断是否符合实验室定位。
- C 跨域连接 / Connection：两个链环由橙色连接段相连，强调设备联网与软硬件协同。含义直接，但作为通用“链接”符号，课题组辨识度较弱。

所有方案共用绿色 #207b66、橙色 #df8747、深色两行字标，白色背景。对比页使用同一模板渲染，原图标分别保存在 [echo.svg](design/logo-options/echo.svg)、[sensing.svg](design/logo-options/sensing.svg)、[connection.svg](design/logo-options/connection.svg)。上半部分108 px图形，下半部分48 px图文组合。选定后再按实际网站尺寸细化并接入共享 Brand/Mark；当前网站的 W 图标不代表已验收。

验证脚本为 scripts/capture-logo-options.mjs，检查三张卡片、六处 SVG 引用加载、无脚本错误和390 px无横向溢出，并输出截图。已目视确认图形轮廓与小尺寸组合可辨认；SVG XML 解析通过。这是概念验证，不代替用户设计验收。

## 历史：W 波形与两行字标（未获验收）

用户提供的 MARS Lab 标识截图体现了清晰轮廓、少量颜色和紧凑两行字样。WiNet Lab 对应采用一条绿色连续 W 波形，右上保留一个橙色信号点；W 对应 Wireless，连续起伏呼应无线波形，信号点作为轻量点缀。字标使用深色加粗 WiNet / Lab 两行布局，页眉与居中页脚共享。图标只有一个 path 和一个 circle，适合小尺寸显示，无渐变、网络细线或额外口号。

源码为 [Mark.astro](../src/components/Mark.astro)、[Brand.astro](../src/components/Brand.astro)，样式在 [global.css](../src/styles/global.css)。见 [logo 预览](verification/logo-preview.png) 和 [验证记录](verification/F02-brand.md)。此方案借鉴参考图的简洁程度与图文比例，未复制其行星、轨道和星形。

用户已取消下面的图像生成流程，不再排查 API key、不再调用生图服务。无需删除或更改用户已配置的系统密钥；本轮没有读取或改动该配置。

## 历史存档：已取消的图像生成尝试

以下为此前过程，不是当前待办。曾尝试一次 API 请求，因 HTTP 401 / invalid_api_key 失败，没有产生生成图片。其提示词和调用记录保留用于追溯。

用户对上一版代码绘制的 W 形节点图标不满意，明确要求调用 gpt-image，围绕实验室研究方向重新绘制。上一版 logo 未获验收；此前居中页脚和移除标语/联系跳转的需求继续有效。

## 设计依据与拟定方向

依据用户提供的 Home 介绍：无线通信、感知、人工智能、软硬件协同设计；可编程无线硬件、无电池与超低功耗连接、多模态感知、具身智能。目标是让无线系统以极低能耗连接、理解并作用于物理世界。

拟定方向：以“无线感知场与智能物理核心的交互”为统一图形主题，形成独立且可辨识的图标，搭配准确的 WiNet Lab 字标。采用协调的多色设计，保留小尺寸辨识度。研究方向用于提炼设计语言，不逐项堆叠机器人、电池、芯片、天线等图标。新图用于页眉与居中页脚，原 Home 词云图不替换。

## 使用的提示词

以下提示词保存于 [实际调用输入](../output/imagegen/winet-lab-logo-v1.prompt.txt)，已用于本次生成请求；服务端在认证阶段拒绝，未返回图片：

```text
Use case: logo-brand
Asset type: an original logo for the header and centered footer of an English-language university research lab website.
Primary request: Design a distinctive, colorful and refined logo for WiNet Lab, the Wireless Intelligence for Networked and Embodied Things Lab at Zhejiang University.
Research context: The lab combines wireless communication, sensing, AI and hardware-software co-design. Its work includes programmable wireless hardware, battery-free and ultra-low-power connectivity, multimodal sensing and embodied intelligence. Its central idea is wireless devices that connect, sense and interact intelligently with the physical world using minimal energy.
Subject: Create one coherent abstract emblem expressing the interaction between a wireless sensing field and an intelligent physical core. Integrate flowing signal geometry with a few purposeful connections and a compact geometric structure. Convey energy efficiency through an economical, balanced form. Develop a fresh identity with a memorable silhouette and considered negative space.
Style/medium: Professional academic technology identity; crisp, vector-like graphic shapes rendered as a high-resolution image. Visually rich but legible when the emblem is displayed at approximately 48 pixels high.
Composition/framing: One horizontal logo lockup, emblem beside the wordmark, optically balanced and centered on a pure-white background. Clear margins, no clipping. Deliver the logo itself, not a presentation board or website mockup.
Color palette: A harmonious multicolor treatment with strong contrast on white, compatible with the site's existing purple, teal and burgundy research word cloud. Use color to distinguish meaningful parts of the emblem; avoid a rainbow of tiny details.
Text (verbatim): "WiNet Lab". Preserve capitalization exactly: W-i-N-e-t, space, L-a-b. Use a distinctive and highly readable contemporary wordmark with carefully balanced spacing.
Constraints: Only this name, no additional slogans or university seals. Original design. No stock Wi-Fi symbol perched above a basic W made of dots and sticks; the previous version used that construction and was rejected. No collage of research icons, no literal battery/robot/brain illustrations, no photorealism, no 3D mockup, no drop shadow, no watermark.
```

## 工具状态与下一步

本会话可调用工具清单中没有内置 image_gen，也没有可进一步发现该工具的搜索入口。已完整阅读本机 imagegen/SKILL.md 及 prompting.md、sample-prompts.md。该技能要求在内置工具不可用时说明 CLI/API 备选方式，且仅在用户明确选择该备选后执行；备选需要本机 OPENAI_API_KEY，不能要求用户在聊天中粘贴密钥。

用户已明确回复“已配置，请生成一张 logo”，API 备选已授权。已完整阅读技能的 cli.md、image-api.md、codex-network.md，使用原配 scripts/image_gen.py，未修改技能脚本或创建自定义 API runner。先完成 dry-run，再执行一次 generate，参数为 gpt-image-2、1536x1024、quality=high、output_format=png、n=1、no-augment。输出目标为 output/imagegen/winet-lab-logo-v1.png，但认证失败，该图片文件不存在。

官方接口返回 HTTP 401、code=invalid_api_key。已安全核对当前进程 key 与 Windows 用户环境变量一致，未发现空白或引号；没有自定义 OPENAI_BASE_URL。仅记录检测布尔结果和错误代码，不保存完整异常中的密钥片段。没有重复发送生成请求、没有改动网站代码。[官方错误说明](https://developers.openai.com/api/docs/guides/error-codes) 将该错误归为密钥不正确；不能据此断言具体是撤销、复制错误或第三方 key，也不能判断用户账户余额。

用户已说明 key 在 OpenAI 官方平台创建。下一步指导用户在官方 API keys 页面创建新的密钥，完整复制并替换 Windows 用户环境变量 OPENAI_API_KEY，再重启应用；不要求用户把密钥发到聊天或写进仓库。已有401无法确定是撤销还是复制问题，重新创建是建议的恢复路径。当前未获知凭证已更新，未重复生成请求。修复认证后继续已授权的单张生成任务，无需重复询问是否同意 API。

生成成功后的本任务验收：检查研究主题表达、字样准确、白底、小尺寸清晰度；将候选图片保存在项目内，记录实际使用的提示词和生成模式，再验证页面布局。用户确认设计后才进入下一子任务。整个项目验收前不上传 GitHub。

## API 调用指导补充

用户随后询问“只有 API key 应该如何调用”。本轮为指导说明，不视为已授权 agent 执行付费生成；未读取密钥或发送生成请求。

2026-09-15 已核对并读取 [官方图片生成指南](https://developers.openai.com/api/docs/guides/image-generation)、[GPT Image 2 模型页](https://developers.openai.com/api/docs/models/gpt-image-2) 和 [官方快速入门](https://developers.openai.com/api/docs/quickstart)。直接生成接口为 POST https://api.openai.com/v1/images/generations，使用 Authorization: Bearer 认证，JSON 中指定 model 和 prompt。以 gpt-image-2 举例，使用1024x1024、medium、PNG；返回 data[0].b64_json，解码后保存图片。不需要在本机部署模型。该模型的免费层不支持；实际使用需可用额度及权限，GPT Image 可能要求组织验证。没有核验用户账户权限或余额。

Windows 指导使用用户环境变量 OPENAI_API_KEY，不将密钥粘贴到聊天或存入网站代码、Git。环境变量设置后需重新打开终端；若要由 agent 使用，也需重启相应应用以继承环境。提供 PowerShell 直接 HTTP 调用示例作为教学内容，运行时会产生 API 用量。本轮不安装 SDK、不创建或执行独立生成脚本。key 若由第三方提供，应先依据服务商文档确认地址和模型权限，不推断其适用于官方接口。
