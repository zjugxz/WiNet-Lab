# Publications 展示调整验证

日期：2026-09-18（Asia/Shanghai）。范围：移除Details pending、调整载体字体/颜色、加强默认年份分隔。用户明确先前提到的4条记录以提供的文档为准。本轮没有改变75条书目字段、排序或资源链接；内部检索证据保留，不把展示依据确认等同于独立出版核验。

## 实现与参考

2026-09-18约10:38重新读取[MARS Lab Publications](https://marslab.tech/publications/)及其页面引用的[index.DtTdWnqn.css](https://marslab.tech/_astro/index.DtTdWnqn.css)。其`.pub-venue`使用KaTeX_Main/serif、700字重及accent颜色；该查询仅作为本轮字体风格参考，线上样式以后可能改变。

WiNet采用系统Georgia/Times衬线斜体，中文宋体回退且不倾斜；期刊#326859、会议/Poster #99533d、书籍#5d527e，保留类型文字，避免只靠颜色区分。无需外部字体加载。年份桌面44px/手机36px，浅绿背景带、左竖线和横线，组间距桌面56px/手机40px。

移除PublicationCard中的标记与提示属性；`verification`仅保留内部历史检索含义，不参与页面展示。四条资料不再以补证作为展示前置条件，未将缺失字段杜撰补齐。

## 验证结果

- Astro check：24文件，0错误、0警告、0提示。
- Astro build：根路径5页成功。
- Playwright Publications：8项全部通过，约4.8秒。覆盖75条完整性、71个出版入口、标记不存在、排序、搜索/组合筛选/空状态、清除、键盘、无JavaScript及320/390/768/1440px布局；320/1440px的WCAG自动检查通过。
- 已更新并目视检查[桌面](publications-desktop.png)、[默认年份边界](publications-years.png)、[手机](publications-mobile.png)、[专著筛选](publications-book.png)、[手机筛选展开](publications-mobile-filters.png)。年份边界截图保持默认全部75条，未通过筛选制造分组效果。截图脚本显式即时滚动，防止全局平滑滚动导致截错位置。
- 本地开发预览`http://127.0.0.1:4321/publications/`返回HTTP 200。
- 此次只改页面局部展示，未改共享Home、路由、资源地址或部署配置，未重复上轮Home/子路径整套检查。未进行新一轮学术检索。

## 版本与交接

后续预览排障：用户反馈字体未变。在两个已打开的本地预览中复现Arial 12px正体；普通刷新仍无效，页面注入的PublicationCard样式及直接请求的开发CSS模块均含旧12px规则。核对命令行后重启本项目4321开发服务，刷新两页，实际计算样式均变为Georgia 20px italic；IEEE COMST颜色rgb(50,104,89)、ACM MobiCom为rgb(153,83,61)、Springer为rgb(93,82,126)，中文为18px normal。75条与无pending提示确认，浏览器截图目视通过。此问题由开发服务旧组件样式响应引起，具体缓存失效触发条件未进一步隔离；未发现需要调整字体源码的证据。上一轮HTTP 200检查不足以确认开发页面样式，本次补足实页验证。排障仅重启本项目服务及更新文档，不重跑无关构建/生产测试，不上传。

开始HEAD为71254b6。保留用户未跟踪DOCX和Word锁文件；尝试读取DOCX哈希时文件被Word占用，未重新计算，不声称本轮复验了哈希。源文档及数据文件未执行写入操作。

代码、相关文档和截图一并本地提交，哈希以git log为准。未上传GitHub，线上仍为先前发布版本。等待用户确认字体、配色和年份分隔效果；技术验证通过不代表用户验收。
