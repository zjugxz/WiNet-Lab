# Cite功能发布记录

2026-09-18，Asia/Shanghai。用户在Cite实现后明确要求“更新文档，上传github仓库”，授权当前功能及相关文档普通推送zjugxz/WiNet-Lab main并触发已有Pages部署；不代表整站用户验收。

## 范围与发布前核对

开始HEAD为f936eed，工作区干净，比origin/main领先2次功能提交（5e89fc2、f936eed）。GitHub API核实远程main仍为6391b28c76cb039fd8970517662badad68d16275，且它是当前main祖先；可正常快进，无需重写历史或强推。

本轮发布Research三篇已发表论文的Cite组件，提供Text（Cell/IEEE样式）、BibTeX、RIS查看/复制/下载及出版页入口，共9份静态引用文件。作者、DOI、年份等来源见[功能与引用核对记录](research-cite-2026-09-18.md)。投稿论文不生成引用入口，未录用PDF继续不公开。没有修改Publications、媒体和PDF原文件，没有新增CMS。

待发布历史审计：f936eed可达540个Git对象、131个跟踪文件；三份受限PDF的原稿Git对象ID和旧公开路径均不在可达历史，public及两种构建也无受限副本；resources、.tools、dist、node_modules未跟踪。本地私有备份分支不是main祖先且不上传。只推送main，不使用--all、--mirror或force。

当前代码与上一轮验证版本一致：Astro检查39文件零错误/警告/提示，两种base各5页及9引用文件构建，3篇×3格式切换/复制/下载、元数据、键盘、手机、无JS回退、无障碍及受限URL检查均通过；原Research资源回归和全站子路径检查通过。本轮先更新发布/维护文档，不为文档改动重复全部本地测试；实际GitHub构建与线上验证另行记录。

## 上传与线上结果

已通过现有127.0.0.1:7890代理普通push main，远程由6391b28快进到1b225ecab6d27e1bfaa566e2311cc247ad861cf7（包含两次功能提交及发布准备文档）。未推送备份分支，未强推。

[Actions 35328701395](https://github.com/zjugxz/WiNet-Lab/actions/runs/35328701395)对应1b225ec，GitHub API确认completed/success，于2026-09-18 09:18:24 UTC（北京时间17:18:24）完成。网站地址：[WiNet Lab Research](https://zjugxz.github.io/WiNet-Lab/research/)。

部署后对真实线上页面执行Chromium检查，全部通过：

- 三篇已发表论文各有Cite，首次默认Text，包含出版页链接；逐一切换Text/BibTeX/RIS，正文与本地核对来源完全一致。
- 九次真实剪贴板复制成功，九个真实下载的文件名和全部字节正确；九个直接引用文件URL均HTTP 200且正文一致。
- 三篇投稿论文无Cite，三份受限PDF旧URL均HTTP 404。
- Esc关闭后焦点返回；390px弹窗及页面没有横向溢出，线上手机截图保存在本地.tools/live-cite-mobile.png。
- 五页均HTTP 200；Publications仍为74条，Contact邮箱入口正确。

本次线上检查经本机现有代理完成，不等同于跨地区网络质量验证。发布后仅将本记录及索引/进度补齐为文档收尾提交，再普通推送main；网站文件不变，最终提交号以main日志为准。技术发布不等于整站用户验收。

下一步等待用户查看线上效果；不自动开展新内容或后台任务。
