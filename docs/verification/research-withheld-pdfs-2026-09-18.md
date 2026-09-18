# 未录用论文PDF下载屏蔽

2026-09-18，Asia/Shanghai。开始版本176bcc5。用户要求屏蔽四篇未录用研究的PDF；范围仅本地网站，不上传或改写历史。

## 实现

| 用户指定论文 | 当前结果 |
| --- | --- |
| Acoustic-Electromagnetic Information Sensing and Security Protection via Intelligent Transparency Metasurfaces | 开始核查时未找到；本轮期间resources新增display/demo的1.mp4，未出现PDF，网站数据及Publications仍未录入。没有现成入口，不推测它对应其他研究 |
| Event-based Visible Light Backscatter Communication System in Underwater Environment | underwater-visible-light-backscatter设为pdf:null，移除公开paper.pdf |
| A low-power single-channel EEG sensor for fatigue monitoring and command interaction | eeg-fatigue-interaction设为pdf:null，移除公开paper.pdf |
| A magneto-mechanical bio-interface with ultra-low-power analog backscatter for inclusive cardiac monitoring | cardiac-monitoring设为pdf:null，移除公开paper.pdf |

schema与组件区分两种情况：省略pdf表示待补，保留禁用占位；pdf:null明确不开放，完全移除Paper按钮。只有显示层隐藏不够，因此删除上述三份public副本，并重新生成dist和.tools/base-dist。删除前逐一验证resources原稿和网站副本SHA-256与历史清单一致，原稿保持不变，可用于以后获准开放时恢复。resources加入.gitignore以减少原稿误提交风险。

预览视频、图片、简介及Demo不变。仍为6张真实卡片、5视频和1图片，开放3份Paper及5项Demo。Publications中的心脏监测记录原本无url/doi下载入口，因此不更改该条书目。

## 验证

- Astro检查31文件，零错误/警告/提示；根路径及/WiNet-Lab/均成功构建5页。
- 新增scripts/check-research-downloads.mjs：两种路径均确认三个受限卡片没有Paper链接或按钮，public与构建输出都没有对应PDF，原URL返回404；逐一用键盘触发剩余8项下载，文件名及字节SHA-256一致。
- 实际4321预览可访问树确认三个Paper控件已消失、Demo保留；直接请求三个旧PDF地址均返回404。
- 原稿未删除，其他Paper/Demo及展示资源未修改。resources未纳入版本控制。

临交付检查发现新增Acoustic-Electromagnetic展示视频触发Vite的Windows EBUSY监听异常。原始resources不是网站自动导入源，因此将它与.tools一起排除开发监听；只重启已核实的本项目Astro进程，重新检查实际预览。新增视频保留原样，不自动录入或补造论文简介。

## Git历史边界与交付

本次移除只作用于最新网站目录和构建产物。旧本地提交e5b3ff5、176bcc5仍含被撤下的PDF；删除当前文件不能使Git历史中的文件消失，也不能撤回浏览者已有下载或缓存。当前请求未授权重写历史或push，因此没有执行。公开仓库后续上传前必须单独处理相关历史，不能直接宣称原稿在仓库层面已保密。

数据/schema/组件、回归检查、三份公开副本删除、Git忽略及维护文档一起本地提交，提交号见git log。未上传。等待用户查看屏蔽效果；第一篇若使用另一题名，需要用户指出其对应卡片后再处理，不能误删其他已开放研究。
