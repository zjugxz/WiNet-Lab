# People页Alumni接口

2026-09-22，Asia/Shanghai。用户要求在People页实现已毕业学生（Alumni）分区，资料后续提供，先实现接口。本轮本地实现并验证，未push，不记录为用户验收。此指示更新2026-09-22早前"分组仅PI/PhD/Master三类、不需要Alumni"的范围决定；PI/PhD/Master既有功能不变。

## 参考核对

实际读取 https://marslab.tech/people/ 的Alumni分区：含致谢语，Postdoc校友为照片卡，学生校友为紧凑文字列表，行格式为**姓名**（去向）— 课题（年份区间）。WiNet接口按学生校友的文字列表形式设计（用户说明为"已经毕业的学生"）；未照搬其致谢语。

## 实现

- `src/lib/people.ts`：新增`alumniSchema`（`id`、`name`必填；`degree`学位、`period`在校区间、`current`毕业去向、`note`课题/论文、`website`可选），`peopleSchema`增加`alumni`数组（默认空）并跨sections与alumni全局校验id唯一；导出`PeopleAlumnus`类型。
- `src/data/people.json`：顶层增加`"alumni": []`显式空数组，其他16人数据未改。
- `src/pages/people.astro`：新增Alumni分区（沿用既有分区标题样式与分隔线）。有记录时渲染紧凑列表行：**姓名**（衬线加粗，可选链接新窗口）学位 （去向） — 课题 （区间）；无记录时显示虚线边框占位框"Alumni information is coming soon."（与站内Gallery/Research占位风格一致）。
- 边界：Alumni无照片、无弹窗、无详情页、无年龄/邮箱——这些属于在读成员功能；校友资料到达后仅填数据即自动渲染，无需改代码。
- 既有PI/PhD/Master渲染、弹窗、详情页、链接行为全部未动。

## 验证

- `astro check` 52文件零错误/警告/提示；根路径与/WiNet-Lab/两种base各22页构建成功（含并行会话同日新增的Gallery页，与本轮无冲突）。
- `scripts/check-people.mjs`两种base通过（新增断言：Alumni标题可见、空数据无列表行、占位文案精确匹配、占位区无链接；根路径需`MSYS2_ENV_CONV_EXCL=SITE_BASE`的既有注意事项不变）。
- 既有17项Playwright测试通过；home.spec的People页h2断言按实装更新为四组（PI/PhD/Master/Alumni），16张照片计数不变。
- 实际4321预览：Alumni分区HTML正确渲染占位态；1440/390px截图目视通过（标题、分隔线、虚线占位框、无横向溢出）。

代码、数据接口、测试与文档一并本地Git提交，未push；等待用户提供校友资料后填充，不记为用户验收。
