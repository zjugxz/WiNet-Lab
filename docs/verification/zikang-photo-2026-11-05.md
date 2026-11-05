# 张子康 People 照片更新（2026-11-05）

用户提供 `resources/people/Zikang Zhang_PhD/1.jpg` 并明确要求更新网站和推送远程。验收范围：People 卡片、悬浮窗和个人详情页使用新照片，公开图片遵循现有 WebP 优化规则，原始文件不提交；构建与相关浏览器检查通过，远程部署后核对线上图片。

## 实现及验证

- 将生成脚本中该成员的输入映射从 `1.png` 更新为 `1.jpg`。仅重新生成 `public/people/zikang-zhang.webp`：sharp 旋转矫正、最长边 960px、WebP quality 82，结果 642×960、21696 字节；原始 JPG 未修改。
- `astro check`：59 文件、零错误/警告/提示；根路径及 `/WiNet-Lab/` 构建均成功，各 24 页。
- `scripts/check-people.mjs` 两种路径均通过，覆盖 18 个成员及详情页。
- 使用真实 Chromium 在 1440px 与 390px 下检查目标成员卡片、弹窗及详情页，确认加载尺寸均为 642×960 且无横向溢出；桌面卡片和手机弹窗截图目视确认人脸完整。

## 发布

- 用户明确要求推送远程。推送前 fetch 确认本地与远程 main 一致；仅提交照片、脚本及本次文档，原有其他工作区修改未纳入。
- 照片提交 `2816a12` 推送至 `zjugxz/WiNet-Lab` main；[Actions #41970253465](https://github.com/zjugxz/WiNet-Lab/actions/runs/41970253465) 完成且结论为 success。直连间歇失败后，通过一次性 Git 地址解析设置连接 GitHub，TLS 验证保持开启。
- 线上 `/people/zikang-zhang/` 返回 HTTP 200 并引用照片；公开 WebP 为 21696 字节，SHA-256 `C365BE6F3253302C681551C7F03D9C5001E3333E77C3F49EFAFDA0A77100BF20` 与本地一致。原图片 URL 不变，浏览器可能在缓存期内继续显示旧图。

技术发布已验证，等待用户查看确认；不记为用户验收。
