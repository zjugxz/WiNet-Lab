# WiNet Lab 图像生成 logo 设计简报

日期：2026-09-15。状态：提示词已准备，尚未生成图片。

用户对上一版代码绘制的 W 形节点图标不满意，明确要求调用 gpt-image，围绕实验室研究方向重新绘制。上一版 logo 未获验收；此前居中页脚和移除标语/联系跳转的需求继续有效。

## 设计依据与拟定方向

依据用户提供的 Home 介绍：无线通信、感知、人工智能、软硬件协同设计；可编程无线硬件、无电池与超低功耗连接、多模态感知、具身智能。目标是让无线系统以极低能耗连接、理解并作用于物理世界。

拟定方向：以“无线感知场与智能物理核心的交互”为统一图形主题，形成独立且可辨识的图标，搭配准确的 WiNet Lab 字标。采用协调的多色设计，保留小尺寸辨识度。研究方向用于提炼设计语言，不逐项堆叠机器人、电池、芯片、天线等图标。新图用于页眉与居中页脚，原 Home 词云图不替换。

## 待执行提示词

以下是准备使用的英文提示词，尚未提交给任何生成模型：

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

当前未切换到 API，未调用生成服务，未生成新图片，也未改动网站代码。下一步等待用户明确选择 API 备选；若选择，先阅读技能的 CLI/API 专用说明、核验本机配置，再使用其提供的脚本生成。不得将当前的“gpt-image 工具”请求记为已确认 API 路径。

生成成功后的本任务验收：检查研究主题表达、字样准确、白底、小尺寸清晰度；将候选图片保存在项目内，记录实际使用的提示词和生成模式，再验证页面布局。用户确认设计后才进入下一子任务。整个项目验收前不上传 GitHub。

## API 调用指导补充

用户随后询问“只有 API key 应该如何调用”。本轮为指导说明，不视为已授权 agent 执行付费生成；未读取密钥或发送生成请求。

2026-09-15 已核对并读取 [官方图片生成指南](https://developers.openai.com/api/docs/guides/image-generation)、[GPT Image 2 模型页](https://developers.openai.com/api/docs/models/gpt-image-2) 和 [官方快速入门](https://developers.openai.com/api/docs/quickstart)。直接生成接口为 POST https://api.openai.com/v1/images/generations，使用 Authorization: Bearer 认证，JSON 中指定 model 和 prompt。以 gpt-image-2 举例，使用1024x1024、medium、PNG；返回 data[0].b64_json，解码后保存图片。不需要在本机部署模型。该模型的免费层不支持；实际使用需可用额度及权限，GPT Image 可能要求组织验证。没有核验用户账户权限或余额。

Windows 指导使用用户环境变量 OPENAI_API_KEY，不将密钥粘贴到聊天或存入网站代码、Git。环境变量设置后需重新打开终端；若要由 agent 使用，也需重启相应应用以继承环境。提供 PowerShell 直接 HTTP 调用示例作为教学内容，运行时会产生 API 用量。本轮不安装 SDK、不创建或执行独立生成脚本。key 若由第三方提供，应先依据服务商文档确认地址和模型权限，不推断其适用于官方接口。
