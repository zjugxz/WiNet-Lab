# Winet Group 域名调研与购买指导

查询日期：2026-09-15（Asia/Shanghai）。动态状态和价格须在购买前再次核对。

## 建议及当前结论

当前重点比较 `winet.group` 与用户新提出的 `winetgroup.tech`：前者简洁，后者完整保留 Winet Group 并突出科技属性。两者均未得到用户对具体域名和报价的最终确认。

| 候选 | 本次查询结果 | 结论 |
| --- | --- | --- |
| `winet.group` | Identity Digital 注册局 RDAP 返回 HTTP 404 | 未找到注册记录；需注册商确认开放注册、是否溢价及报价 |
| `winetgroup.tech` | IANA 指定 Radix RDAP；本机请求因证书吊销检查服务不可达而未完成，网页工具也未取得结果 | 注册状态未知；连接失败不能推断可用或已注册，须在注册商页面查询 |
| `winetgroup.org` | Public Interest Registry 的 RDAP 返回 HTTP 404 | 未找到注册记录；可作为备选，但不适合保留阿里云中国大陆 ICP 备案路径 |
| `winetgroup.com` | Verisign RDAP 返回匹配的域名对象；注册时间 2026-08-07T14:03:18Z | 已被注册，不能按普通新域名直接注册 |
| `winetlab.org` | rdap.org 返回 HTTP 404，未另外完成注册局直接核验 | 仅次要备选，名称也不如 Winet Group 直接匹配 |
| `winetgroup.cn` | 本次 IANA RDAP 引导表未提供 `.cn` 服务；rdap.org 返回 HTTP 404 | 状态未知，须使用注册商查询，不能判断为空闲 |

重要区别：注册局找不到记录，不等于注册商一定能出售；普通后缀价格，不等于具体域名价格。

## 公开价格参考

Porkbun 官方价格表，美元/年，仅适用于普通、非溢价域名。不是 `winet.group` 或其他具体名称的订单报价。

| 后缀 | 当前首年参考价 | 当前续费参考价 | 按当前价格计算的三年参考合计 |
| --- | ---: | ---: | ---: |
| `.group` | USD 6.18 | USD 21.11 | USD 48.40 |
| `.tech` | USD 6.99 | USD 50.98 | USD 108.95 |
| `.org` | USD 7.98 | USD 11.84 | USD 31.66 |

三年合计仅为首年价加两次当前续费价，不代表未来锁价。Porkbun 页面称这些价格已含 ICANN 等费用；付款时仍需核对实际结算、支付渠道及币种。

`.tech` 价格来自 Porkbun 的 `.tech` 官方产品页；其普通续费价高于本次查得的 `.group` 普通续费价。该比较不代表具体名称的报价。

阿里云 `.group`、`.tech` 产品页及价格总览的动态价格未能通过本次抓取取得具体名称报价；不能据此给出阿里云具体首年或续费数字。其官方说明明确区分普通域名和精品/溢价域名，最终以具体订单价格为准。

## 注册渠道与部署

- 建议先在阿里云万网中国站查询 `winet.group`，原因是可用中文操作，且有利于保留后续中国大陆部署的选择。实际是否可备案仍需符合后缀、注册商、实名认证和主体等要求。
- 工信部公布的域名体系包含 `.GROUP` 和 `.TECH`，不表示某个域名已经完成备案。
- 阿里云当前文档明确说明 `.org` 未获得相应后缀批复，无法在阿里云进行 ICP 备案。若选 `.org`，应在选托管地区时纳入该限制。
- Porkbun 可作为公开价格比较和海外注册渠道备选，选择海外注册商前需确认未来托管安排。注册商与网站托管服务可以分开选择。
- 尚未选定托管地区、服务器、CMS 或发布服务；尚未为此购买任何产品。

## 当前交给用户的操作

1. 针对用户最新候选，打开 https://wanwang.aliyun.com/tlds/tech 。
2. 在域名前缀输入框填写 `winetgroup`，后缀保持 `.tech`，点击查询。比较 `winet.group` 时使用 https://wanwang.aliyun.com/tlds/group ，前缀为 `winet`。
3. 核对结果是否为所查的完整域名，是否可注册，是否标记精品/溢价，以及首年、续费报价；将结果文字或截图反馈。
4. 先确认以上信息，再进入账户、注册主体、年限和购买环节。

后续指导应确认账号由课题组可长期控制、域名持有人符合学校或课题组安排、注册年限及续费设置符合用户意愿。支付由用户完成或另行明确授权；当前没有付款授权。

## 购买完成的验收标准（尚未执行）

- 注册商控制台出现用户选定的完整域名，并显示注册成功及到期日期。
- 用户确认能管理域名和接收到必要通知，注册资料和费用符合其决定。
- 更新本文和进度文档的实际结果，保存对应本地 Git 记录；得到用户确认后才进入下一子任务。

## 来源与可复核接口

- IANA RDAP 服务引导表：https://data.iana.org/rdap/dns.json
- `.group` 注册局：https://rdap.identitydigital.services/rdap/domain/winet.group
- `.org` 注册局：https://rdap.publicinterestregistry.org/rdap/domain/winetgroup.org
- `.com` 注册局：https://rdap.verisign.com/com/v1/domain/winetgroup.com
- `.tech` 注册局（本次连接失败，不能用于判断注册状态）：https://rdap.radix.host/rdap/domain/winetgroup.tech
- Porkbun 普通后缀价格：https://porkbun.com/products/domains
- Porkbun `.tech` 价格：https://porkbun.com/tld/tech
- 阿里云 `.group` 产品页：https://wanwang.aliyun.com/tlds/group
- 阿里云 `.tech` 产品页：https://wanwang.aliyun.com/tlds/tech
- 阿里云价格说明：https://help.aliyun.com/zh/dws/product-overview/domain-name-fees
- 阿里云域名价格总览：https://wanwang.aliyun.com/help/price.html
- 阿里云域名核验要求：https://help.aliyun.com/zh/icp-filing/basic-icp-service/user-guide/prepare-and-check-the-domain-name
- 工信部域名体系：https://domain.miit.gov.cn/indexd.html
- 工信部域名列表接口：https://domain.miit.gov.cn/yuming/getYMList
