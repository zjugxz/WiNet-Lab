# EEG研究资料录入与验证

日期：2026-09-18（Asia/Shanghai）。本地完成，待用户查看；未上传GitHub。

## 内容依据

用户指定将A low-power single-channel EEG sensor for fatigue monitoring and command interaction加入Wireless without Batteries。实际源目录为`resources`，消息中的`resouorces`为拼写差异。

PDF共22页。已提取首页/第二页文字并用Poppler渲染首页目视核对题名、作者和摘要；未声称审阅整篇论文。文件名含wireless，正文题名不含此词，因此页面使用正文及用户指定题名。简介概括干电极、低功耗反向散射、神经信号重建、疲劳监测和免手操作交互；没有添加期刊/年份等未提供信息。摘要记载270mAh电池，因此只按用户要求归类，不将研究原型宣传为无电池设备。

display视频画面包含认知任务、EEG信号及预测疲劳状态。预览为原MP4，34.087007秒，H.264/AAC，968×544。原音轨保留；没有提供独立字幕，也未生成或声称完成音轨逐字转录。

## 文件映射

以下源目录中的论文目录名均为`A low-power single-channel EEG sensor for fatigue monitoring and command interaction`。

| 来源 | 网站文件（public/下） | 大小/处理 |
| --- | --- | --- |
| resources/paper/A low-power wireless single-channel EEG sensor for fatigue monitoring and command interaction.pdf | research/eeg-fatigue-interaction/paper.pdf | 8,011,828字节，原样复制 |
| resources/display/论文目录/1.mp4 | research/eeg-fatigue-interaction/preview.mp4 | 31,892,531字节，原样复制 |
| 上述预览第15秒画面 | research/eeg-fatigue-interaction/poster.jpg | 67,160字节，作为视频封面 |
| resources/demo/论文目录/1.mp4、2.mp4、3.mp4 | research/eeg-fatigue-interaction/demos.zip | 45,503,284字节，包含三个原视频 |

完整视频时长分别为74.28、184.09、128.81秒。ZIP只打包，不转码、裁剪、合并或重新压缩视频编码；原文件名1.mp4/2.mp4/3.mp4保留在ZIP根目录。网页说明Demo包含三个完整视频（ZIP），不将短预览当作完整版。

SHA-256核对结果：

| 文件 | SHA-256 |
| --- | --- |
| 原PDF与网站PDF | `000a7abdab3619ed76cf7034cbad13886479589629a780542a68954e058f7772` |
| 原display/1.mp4与网站预览 | `5706be790106633138def371db05ddfddb8bba2149d323d1deab3a75c95b9c03` |
| Demo 1.mp4原文件及ZIP条目 | `a46295f6eb5a6d407ccc7bd51156abe61e569bccd21ae3e27685917c8de7d00f` |
| Demo 2.mp4原文件及ZIP条目 | `2045408c55e9a3b8369147ce7ff2810745193e963202d4931bd4734fc791c5f5` |
| Demo 3.mp4原文件及ZIP条目 | `5a9f87e8da7218799f5d79fa4f4947e79039e4ee754010f44e4383b39e958c0c` |
| 完整demos.zip | `8fdf5442a4d4d431fa5134ae1aa173e93ae22e0c5a4a2b8b6946d70422f14320` |

## 验证

- JSON格式与Astro检查通过，31文件零错误、警告和提示；根路径与/WiNet-Lab/各构建5页。
- ZIP恰含三个源文件，CRC检查通过，每个解压条目的SHA-256与原文件一致；PDF、预览拷贝一致。
- 真实生产页面在两种base下验证：正确方向内一张真实卡片、另外两张占位；封面返回200，短视频播放且解码尺寸968×544，读取时长34.087007秒，跳至结尾后正常结束、无媒体错误。没有声称逐帧看完全部Demo。
- 两种base下通过键盘分别下载PDF和ZIP；保存文件名正确、下载字节的SHA-256与网站文件一致。
- 320/390/768/1440px无横向溢出；既有子路径全站导航/样式/74条Publications/筛选/手机菜单检查通过，无失败请求。
- 实际4321开发页1440px及390px截图目视通过；键盘播放真实短视频，读取到13.6秒/未暂停/无错误。停止播放、恢复视口并保留预览。
- 开发预览曾出现Windows EBUSY错误，原因是Vite误监听`.tools/base-dist`中构建复制的视频。`astro.config.mjs`新增`**/.tools/**`监听排除；配置自动重启后重新子路径构建及实际预览检查，无错误浮层，源文件/网页资源仍正常监听。

媒体检查与封面提取使用忽略目录.tools中的imageio-ffmpeg 0.6.0/FFmpeg 7.1；部署不需要该工具。一次性真实资源测试脚本及PDF/视频核对中间图也只位于.tools，不作为网页内容或发布资源。

## 交付边界

开始提交为94d2cb9。仅指定EEG资料的网站副本、研究数据、监听修复及文档纳入本地提交，resources原资料和其他论文未动、未自动纳入Git；Publications的74条记录不变。未push，技术验证不等于用户验收。下一步请用户查看本篇卡片效果。
