# People首批Alumni资料集成与验证

日期：2026-09-23（Asia/Shanghai）。本轮仅更新本地网站，不发布，不记录为用户验收。

## 范围与资料

- Chuchuan Ceng与Kaixuan Xie均于2026年3月毕业，研究生期间从事强化学习和边缘计算研究，现任Shopee Algorithm Engineer。
- 两份差异化英文简介来自各自`resources/people/*_Alumni/个人简介.txt`；没有补造学位、邮箱、年龄、论文、项目或个人链接。
- 两张300×400 JPEG原图经`sharp`转换为同尺寸WebP q82，输出`public/people/chuchuan-ceng.webp`（约7KB）与`kaixuan-xie.webp`（约5KB），不放大、不修改原图。

## 实现

- `people.json`的`alumni`记录改为结构化人物资料：`id/name/photo/graduation/organization/position/bio`。`organization`可统一表达企业、高校或研究机构，`graduation`校验`Month YYYY`。
- Alumni复用`PeopleCard`：4:5照片卡片显示姓名与`Algorithm Engineer at Shopee`，不渲染空邮箱或链接按钮。
- `PersonDialog`同时读取在读成员和Alumni；毕业生显示`Alumni`、职位与单位、`Graduated March 2026`和简介，年龄/邮箱保持隐藏。职位槽和简介flex基准固定，确保不同资料长度不改变弹窗、图片区和文字区尺寸。
- `/people/chuchuan-ceng/`与`/people/kaixuan-xie/`提供无JavaScript回退，展示相同资料且无邮箱/链接控件。
- 照片处理脚本增加两位Alumni映射，并修复文件大小日志原先显示`NaN KB`的问题。

## 验证

- `astro check`：59文件，0错误、0警告、0提示。
- 根路径与`SITE_BASE=/WiNet-Lab/`各静态构建24页成功，包含18个人物详情页。
- `scripts/check-people.mjs`在两种base均通过：18张人物资料、18个详情页；两位Alumni卡片/WebP/路由；弹窗打开、关闭、背景遮罩、差异化简介、毕业时间、职位、无邮箱/年龄/链接；固定弹窗/照片/简介区；320/390/760/1440px无横向溢出；axe WCAG 2 A/AA与2.1 AA无违规；无失败请求。
- 既有17项Playwright测试全部通过，People首页照片断言由16更新为18。
- 1440px和390px整页及Alumni弹窗截图已目视检查：照片无变形或切脸，文字无重叠，长简介在固定区域内滚动，手机弹窗无溢出。

## 状态

本地实现完成，未推送GitHub。用户于2026-09-23查看后回复“很好”并要求提交，本批本地效果已确认；该确认不构成远程发布授权。
