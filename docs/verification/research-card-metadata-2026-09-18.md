# Research排序、投稿状态与刊会样式

2026-09-18，Asia/Shanghai。开始HEAD：9d95b74。实现及验证完成，等待用户查看，未上传GitHub。

## 最终行为

1. 每个方向先显示有完整Demo的论文，再显示无Demo论文；两组内部保留源数组顺序。Bits Meet Physics显示顺序为磁场/RF、机械超表面、水下通信。第二方向仍为EEG、心脏监测、Mighty。无Demo的卡片和空方向占位均不显示Demo coming soon。
2. 未提供/未开放PDF的卡片显示不可点击的Paper coming soon。已知受限论文的提示说明manuscript in submission；它不是下载链接。三份PDF继续不在公开目录或构建产物，原地址404。
3. 已发表论文的刊会行放在图片下方、标题上方。刊会名称18px Georgia粗斜体、暖棕色#a45122；年份13px衬线加粗及轻微字距，长刊名自然换行。

参考来源：[MARS Lab Research](https://marslab.tech/research/)，本日实读并目视检查。参考页同样将刊会/年份放在标题之前，样式采样为暖棕色rgb(180,83,9)、13.44px粗衬线（KaTeX_Main）。本网站采用已有本地Georgia体系调整字号、斜体和颜色，不引入参考站内容或外部字体。

## 数据与用户补充

新增可选publication对象：status为published/submitted，venue/year可选。已有3篇使用前次PDF核对和当前Publications记录：Device 2026；Cell Reports Physical Science 2026；IEEE Transactions on Mobile Computing 2025（Mighty使用正式卷期年，不使用在线年2024）。

用户明确所有Paper coming soon论文暂不填写投稿去向和年份，仅保留接口。水下通信、EEG、心脏监测均只有status:submitted，不补刊会/年份，也不显示空的刊会行。后续录用后更新research.json相应对象即可；PDF开放仍需另行确认和补入获准文件，不由status自动恢复。该接口是结构化数据能力，在线CMS仍未实现。

## 验证

- Astro检查32文件，零错误/警告/提示；两种base各构建5页。
- scripts/check-research-downloads.mjs在根路径和/WiNet-Lab/均验证：稳定分组顺序、无Demo占位按钮、3条完整刊会/年份及计算字体颜色、投稿3篇无刊会行但有禁用Paper coming soon、旧PDF链接404及public/构建文件缺失；剩余8项下载经键盘触发并比对文件名和SHA-256。320/390/768/1440px均无横向溢出。
- scripts/check-research-card.mjs同步缺Demo断言，两种base均通过无点击自动静音播放、真实回绕循环、键盘暂停/恢复、双列/手机、按钮尺寸、独立下载及WCAG 2 A/AA自动检查。
- 实际4321页面显示排序和标签，刊会字体计算值为italic 700 18px Georgia、rgb(164,81,34)。1440px双列和390px单列截图目视通过，样式已生效，临时视口已恢复。

媒体文件、三份开放PDF、原始resources及Publications均未改动。代码、已有检查更新和文档一并本地提交；未push、不重写Git历史。之前记录的受限PDF历史提交风险仍存在，本轮仅调整页面表现。下一步等待用户查看本轮三项需求的效果。
