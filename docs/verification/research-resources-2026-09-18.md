# Research重构资料导入验证

日期：2026-09-18，Asia/Shanghai。开始版本：9c6b0cf。状态：本地实现及验证完成，等待用户查看；未上传，不等于用户验收。

## 范围与来源

用户要求按重构后的resources导入全部资料。实际盘点22份源文件：6份PDF、6份display素材、10份demo视频。按用户目录分为Bits Meet Physics和Wireless without Batteries各3篇；Embodied Intelligence of Things无材料，保留占位。Publications书目不变。

使用PDF技能提取并渲染6篇首页，磁场/RF与超表面另核对第二页正文摘要；简介由所附PDF摘要整理，未独立核验发表状态，也未通读全部正文。磁场/RF正式题名为“Physical computing across magnetic and RF domains for passive wireless information retrieval”；EEG标题没有文件名中多出的wireless；心脏监测题名来自正文，不能使用npj文件名代替。未给稿件补造刊期、年份或医学有效性结论。

## 资料对应

网站副本均位于`public/research/{id}/`，PDF统一为paper.pdf。原资料文件名、目标文件、文件大小和SHA-256见[完整22文件清单](research-resources-manifest-2026-09-18.json)。每个源文件都有对应，原文件哈希前后不变。

| 方向 | 网站id / 研究 | 展示素材 | 完整Demo |
| --- | --- | --- | --- |
| Bits Meet Physics | magnetic-rf-computing / 磁场与RF物理计算 | display/1.mp4，41.47秒；HEVC转H.264/AAC预览 | demo/1.mp4原文件，独立demo.mp4 |
| Bits Meet Physics | underwater-visible-light-backscatter / 水下可见光反向散射 | System Overview_01.png，2872×918，原图完整显示 | 未提供，对应按钮禁用 |
| Bits Meet Physics | mechanical-metasurface / 机械可编程超表面 | Mechanically Programmable.mp4，78.67秒 | 同名原视频，与display哈希相同，显式共用网站副本 |
| Wireless without Batteries | eeg-fatigue-interaction / 单通道EEG | display/1.mp4，34.09秒，保持既有网站文件 | demos.zip，包含原1.mp4、2.mp4、3.mp4 |
| Wireless without Batteries | cardiac-monitoring / 磁机械心脏监测 | display/3.mp4，35.09秒 | demos.zip，包含原1.mp4、2.mp4、3.mp4、4.mp4 |
| Wireless without Batteries | mighty-drone-backscatter / 无人机Mighty | Might Demo.mp4，102.33秒 | 同名原视频，与display哈希相同，显式共用网站副本 |

共6份Paper下载和5项Demo下载（3个MP4、2个ZIP）。ZIP不转码内部视频，每项原文件字节及SHA-256一致；重复display/demo仅在核对完全相同后共用路径，不将不同的预览冒充完整演示。EEG现有4个网站资产未改。所有新增视频封面从第2秒提取；EEG沿用此前第15秒封面。没有添加媒体说明行。

磁场/RF预览用FFmpeg转换为H.264、yuv420p、AAC及faststart，保持原时长/尺寸，供网页兼容播放；Demo保留原HEVC文件。其余预览不重编码。5段网页视频均可用H.264播放。源display中的Mighty和超表面本身超过一分钟，本轮按用户指定文件原时长导入，未自行截短。网站research资产合计319,280,494字节，未做全站媒体压缩或远程托管。

## 验证结果

- Astro检查31文件，零错误/警告/提示；`/`和`/WiNet-Lab/`均成功构建5页。
- 本轮临时真实素材检查`.tools/check-research-import.mjs`在两种路径均通过：前两个方向各3张真实卡片、第三方向1张占位、5视频/1图；视频在首次点击之前自动静音播放，移动到结尾前观察真实播放回绕；全部11个下载入口由键盘触发，文件名及下载SHA-256与网站源文件一致；图片实际解码为2872×918。
- 320/390/768/1440px无横向溢出；前两种宽度单列、后两种双列且第三张换行；可用按钮30px，所有卡片无figcaption。两种base下WCAG 2 A/AA自动扫描零违规、无页面JS错误或HTTP错误。自动扫描不替代完整人工无障碍审计。
- 首次临时检查在无障碍工具初始化时失败，原因是测试未显式创建BrowserContext；修正测试上下文后完整重跑通过，非产品故障。
- `scripts/check-base.mjs`全站子路径导航、样式、图片、74条Publications及筛选、手机菜单通过。原脚本会把离开Research时浏览器取消未完成的视频范围请求误判为故障；只过滤media类型的net::ERR_ABORTED，其余请求失败/HTTP错误仍失败。媒体和下载本身已由上一项独立验证。
- 实际4321开发预览首次对新增视频返回404（已存在EEG正常），而生产构建验证正常。确认本项目Astro PID35796后仅重启该服务，新视频随即加载。实际1440px整页与390px局部截图目视通过，5视频均加载到readyState4并观察到时间前进，无媒体错误；浏览器会暂缓视口外视频，滚动进入后自动开始。临时视口已恢复。

## 交付

src/data/research.json、网站资产副本、子路径检查修正及本次维护/验证文档一并本地Git提交，提交号见git log。resources原目录保持未跟踪，不修改或删除用户资料；未push。下一步等待用户查看Research卡片效果，补充水下通信完整Demo及第三方向材料需后续用户指示。
