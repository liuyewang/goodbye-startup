# goodbye.help Cloudflare 配置规范审查与变更记录

> **其他会话接手前必读**：本文件是 goodbye.help 域名在 Cloudflare 上的**唯一事实来源**。任何涉及 DNS、SSL/TLS、重定向、缓存、安全设置的改动，先读本文件再动手，改完必须回写到「变更清单」。
>
> - 最新生效时间：2026-11-06 19:40（Asia/Shanghai）
> - 执行方式：全部通过 Cloudflare API / wrangler CLI，无网页点选
> - Zone：`goodbye.help`（ID `379782de43b72bb7918c71dbbe606edc`），账户 `Guge928022663@gmail.com's Account`，套餐 Free
> - 在线同名文档（同步给其他会话）：飞书云盘 → goodbye-startup 文件夹 → https://my.feishu.cn/docx/BdeNdZy7ooLanMxR1YVcSrm7nXb

---

## 1. 结论速览

本次共修改 6 项配置，全部通过验证：

| # | 配置项 | 变更前 | 变更后 | 官方依据 |
|---|---|---|---|---|
| 1 | Always Use HTTPS | off | **on** | [Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/)（Free 套餐可用） |
| 2 | 最低 TLS 版本 | 1.0 | **1.2** | [Minimum TLS Version](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/minimum-tls/)（Free 可用，仅支持 zone 级） |
| 3 | SSL/TLS 加密模式 | Full | **Full (strict)** | [Encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)（源站证书已验证有效） |
| 4 | HSTS | 关闭 | **开启，max-age=15552000（6 个月）+ includeSubDomains，preload 关闭，nosniff 开启** | [HSTS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/)（Free 可用；max-age 支持 1–12 个月） |
| 5 | www 规范化 | www 直接返回 200 同站点（重复内容） | **www → 裸域 301，保留路径与查询串** | [Single Redirects](https://developers.cloudflare.com/rules/url-forwarding/)，Free 套餐 10 条规则、支持通配 |
| 6 | CAA | 无记录 | **允许 letsencrypt.org 与 pki.goog（issue + issuewild）**，Cloudflare 自动补齐 comodoca / digicert / ssl.com | [Add CAA records](https://developers.cloudflare.com/ssl/edge-certificates/caa-records) |

另有一项**半完成**：DNSSEC 已在 Cloudflare 侧开启并生成 DS，但 DS 尚未提交到注册商（详见第 5 节待决策项）。

---

## 2. 变更前现状（盘点于 2026-11-06 19:25）

### 2.1 Zone 级设置（56 项，仅列关键项）

| 设置 | 变更前值 | 判定 |
|---|---|---|
| ssl | full | ⚠️ 应 strict |
| always_use_https | off | ⚠️ 应 on |
| min_tls_version | 1.0 | ⚠️ 应 1.2 |
| security_header（HSTS） | enabled=false | ⚠️ 缺失 |
| automatic_https_rewrites | on | ✅ |
| brotli / http3 / tls_1_3 | on | ✅ |
| 0rtt | off | ✅ 故意保持（官方提示重放风险） |
| rocket_loader | off | ✅ Next.js 不应开启 |
| cache_level | aggressive | ✅ 合法枚举值，保持 |
| security_level | medium | ✅ 默认，改高会误杀正常流量 |
| ipv6 / ech / pq_keyex | on | ✅ |
| always_online | off | ✅（该功能已不推荐使用） |
| waf | off | ✅ Free 套餐无付费 WAF 规则集 |
| minify | 全 off | ✅ Pages 产物已预压缩 |
| browser_cache_ttl | 14400 | ✅ 保持 |

### 2.2 DNS 记录（13 条）

| 类型 | 名称 | 值 | 说明 |
|---|---|---|---|
| CNAME | goodbye.help | goodbye-startup.pages.dev | 主站（proxied） |
| CNAME | www.goodbye.help | goodbye.help | 主站别名（proxied），此前由 Pages 自定义域占用 |
| CNAME | startup.goodbye.help / www.startup.goodbye.help | goodbye-startup.pages.dev | 同一 Pages 项目的别名域 |
| A | wise.goodbye.help | 3.33.255.208 | 第三方商店源站（AWS API Gateway + Let's Encrypt 证书） |
| MX | goodbye.help ×3 | mx1/2/3.qiye.aliyun.com | 阿里企业邮箱 |
| TXT | goodbye.help | SPF `-all`、google-site-verification | 正常 |
| TXT | _dmarc / default._domainkey | DMARC p=none、DKIM | 正常 |
| TXT | wise.goodbye.help | lemonsqueezy-verification | 正常 |
| CAA | — | 无 | ⚠️ 缺失 |

### 2.3 Pages 项目

- 项目 `goodbye-startup`，生产分支 `main`，源 GitHub `liuyewang/goodbye-startup`，构建产物目录 `.vercel/output/static`
- 自定义域共 5 个：`goodbye-startup.pages.dev`、`goodbye.help`、`startup.goodbye.help`、`www.goodbye.help`、`www.startup.goodbye.help`
- Page Rules：0 条；Redirect Rules：无

---

## 3. 关键发现：www 跳转此前为什么做不成

给 www 加 Redirect Rule 后规则**不生效**，curl 仍是 200 由 Pages 直接返回。根因：

> Pages 的**自定义域绑定会「抢占」该主机名**，请求在进入 zone 规则（Single Redirects 阶段）之前就被 Pages 路由接管，导致 Redirect Rule 被跳过。这是 Cloudflare Pages 的已知行为，社区有同型案例（[Redirect Rule for www doesn't fire on Pages projects](https://community.cloudflare.com/t/redirect-rule-for-www-doesnt-fire-on-3-of-4-pages-projects-with-identical-setup/941494)）。

处置：**解除 `www.goodbye.help` 的 Pages 自定义域绑定**（DNS 记录保留、仍走 Cloudflare 代理，证书由 `*.goodbye.help` 通配覆盖），让边缘 Redirect Rule 生效。解除后立刻验证通过。

⚠️ 后续如果有人把 `www.goodbye.help` 重新加回 Pages 自定义域，301 会立刻失效——这是本配置最脆弱的耦合点。

---

## 4. 变更清单（含精确命令，可直接重放/回滚）

### 4.1 Always Use HTTPS

```bash
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE/settings/always_use_https" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"id":"always_use_https","value":"on"}'
# 回滚：value 改回 "off"
```

### 4.2 最低 TLS 1.2

```bash
curl -X PATCH ".../settings/min_tls_version" -d '{"id":"min_tls_version","value":"1.2"}'
# 回滚：value 改回 "1.0"
```

### 4.3 SSL/TLS → Full (strict)

变更前先受控验证源站证书：临时切 strict 后逐一 curl 全部主机的 `goodbye.help` / `www` / `startup` / `wise` / `www.startup`，全部返回正常（无 526），故保留。

```bash
curl -X PATCH ".../settings/ssl" -d '{"id":"ssl","value":"strict"}'
# 回滚：value 改回 "full"
```

> 注意：`wise.goodbye.help` 源站是第三方（Lemon Squeezy 商店），证书为 Let's Encrypt。若该源站未来证书失效，strict 下会返回 526，此时应优先让对方修证书，而不是整体降级到 Full。

### 4.4 HSTS

```bash
curl -X PATCH ".../settings/security_header" -H "Content-Type: application/json" -d '{
  "id":"security_header",
  "value":{"strict_transport_security":{
    "enabled":true,"max_age":15552000,
    "include_subdomains":true,"preload":false,"nosniff":true}}}'
# 回滚：enabled 改 false、max_age 改 0、include_subdomains 与 nosniff 改 false
```

取值理由：官方允许 1–12 个月，首次开启取 6 个月（可观测期）；`preload` 未开（需 12 个月 + 提交浏览器 preload 列表，属于难以撤回的动作）；`includeSubDomains` 已开，因为所有现网子域都由 `*.goodbye.help` 通配证书覆盖且强制 HTTPS。

### 4.5 www → 裸域 301（Single Redirects）

```bash
# 1) 解除 Pages 自定义域（否则规则永不触发）
curl -X DELETE ".../accounts/$ACCOUNT/pages/projects/goodbye-startup/domains/www.goodbye.help"

# 2) 写入 zone 级动态重定向规则
curl -X PUT ".../zones/$ZONE/rulesets/phases/http_request_dynamic_redirect/entrypoint" \
 -H "Content-Type: application/json" -d '{
 "rules":[{
   "action":"redirect",
   "action_parameters":{"from_value":{
     "status_code":301,
     "target_url":{"expression":"concat(\"https://goodbye.help\", http.request.uri.path)"},
     "preserve_query_string":true}},
   "expression":"(http.host eq \"www.goodbye.help\")",
   "description":"www to apex canonical 301"}]}'
```

回滚：

```bash
# 删除规则（先读入口规则集 ID，再删除）
curl -X DELETE ".../zones/$ZONE/rulesets/b261f455850c443dbe4e4c4bdb320afb"
# 恢复 Pages 自定义域
curl -X POST ".../accounts/$ACCOUNT/pages/projects/goodbye-startup/domains" -d '{"name":"www.goodbye.help"}'
```

### 4.6 CAA

```bash
# 4 条：issue / issuewild 各允许 letsencrypt.org 与 pki.goog
curl -X POST ".../zones/$ZONE/dns_records" -H "Content-Type: application/json" -d \
 '{"type":"CAA","name":"goodbye.help","ttl":1,
   "data":{"flags":0,"tag":"issue","value":"letsencrypt.org"},
   "content":"0 issue \"letsencrypt.org\""}'
# issuewild / pki.goog 同理
```

依据：当前边缘证书由 **Google Trust Services** 签发，`wise.goodbye.help` 源站证书由 **Let's Encrypt** 签发，两者都必须在允许列表内。Cloudflare 在 zone 存在任意 CAA 记录且启用 Universal SSL 时，会**自动补齐**其合作 CA（实测已出现 comodoca / digicert / ssl.com），因此不会阻断未来的证书续签。

回滚：删除这 4 条 CAA 记录即可（`DELETE /zones/$ZONE/dns_records/{id}`）。

### 4.7 DNSSEC（半完成）

```bash
curl -X PATCH ".../zones/$ZONE/dnssec" -d '{"status":"active"}'
# 返回 status=pending，并给出 DS：
# goodbye.help. 3600 IN DS 2371 13 2 955F246D2E237E86AB9F72A86AB394052C305441AFC72434F740AA8E59A653F8
```

Cloudflare 侧已签名，但**注册商侧尚未添加 DS**（whois：`DNSSEC: unsigned`；注册商为 Alibaba Cloud / HiChina）。在 DS 提交前，公网解析不会启用 DNSSEC 校验，属于"已就绪但未生效"状态。

---

## 5. 待决策事项（未执行，需 owner 拍板）

| # | 事项 | 现状 | 建议 | 风险 |
|---|---|---|---|---|
| 1 | DNSSEC DS 提交 | CF 侧 pending | 登录阿里云域名控制台为 goodbye.help 添加上面的 DS；若阿里云不支持 .help 的 DS，则回滚 CF 侧到 disabled | 配错 DS 会导致域名在验证型解析器下无法解析 |
| 2 | DMARC 策略 | `p=none`（仅监控） | 观察 2–4 周报告后升为 `p=quarantine` | 直接升级可能误拦正常邮件 |
| 3 | startup 别名域重复内容 | `startup.goodbye.help`、`www.startup.goodbye.help` 与主域返回同一站点 | 加 301 到主域，或设 noindex | 与 www 同型问题，需同样先解除 Pages 绑定 |
| 4 | Pages 预览域名索引风险 | `*.goodbye-startup.pages.dev` 可公开访问、可被爬 | Pages 侧限制预览访问需付费方案；短期可在 robots 层面处理 | 低 |
| 5 | 0-RTT | 关闭 | 保持关闭 | 开启有重放攻击面，官方明确提示 |

---

## 6. 验证结果（2026-11-06 19:38，全部非视觉 curl）

| 检查项 | 结果 |
|---|---|
| `http://goodbye.help/pricing` | 301 → `https://goodbye.help/pricing` |
| `http://www.goodbye.help/pricing?ref=test` | 单跳 301 → `https://goodbye.help/pricing?ref=test`，最终 200，hops=1 |
| `https://www.goodbye.help/pricing?ref=test` | 301 → `https://goodbye.help/pricing?ref=test`（路径与查询串均保留） |
| TLS 1.0 / 1.1 握手 | 拒绝（000） |
| TLS 1.2 | 200 |
| HSTS 响应头 | `strict-transport-security: max-age=15552000; includeSubDomains` |
| HTTP/3 | `alt-svc: h3=":443"; ma=86400` |
| Brotli | 静态资源 `content-encoding: br` |
| 静态资源缓存头 | `cache-control: public, max-age=31536000, immutable`（未被改写） |
| 边缘证书 | GTS（WE1），SAN 覆盖 `goodbye.help` 与 `*.goodbye.help` |
| CAA 解析 | 权威 NS / 1.1.1.1 / 8.8.8.8 三处一致，共 10 条（4 条本域 + 6 条 CF 自动补齐） |
| DNSSEC | status=pending，DS 已生成待提交 |

---

## 7. 其他会话交接说明

1. **不要再给 www 加 Redirect Rule 之前先动 Pages 绑定**：顺序必须是「先解除 Pages 自定义域 → 再建规则」，反了不会生效。
2. **不要把 `www.goodbye.help` 重新加回 Pages 自定义域**，会静默破坏 301。
3. **改 SSL 模式前先做受控验证**：临时切 strict 后立刻 curl 四个主机，出现 526 立即回滚。
4. **不要开 Rocket Loader**：Next.js 应用容易被它破坏 hydration。
5. **token 不入库**：本机凭证在 `~/.config/cloudflare/goodbye.help.token`（600 权限），项目内不得出现明文。
6. 每次配置变更后，同步更新本文件第 4 节与第 6 节，并更新飞书在线同名文档。

---

## 8. 复核与增量优化（2026-11-06 19:40，第二轮）

第二轮用 CLI 重新拉取全部 56 项 Zone 设置、13+4 条 DNS、DNSSEC、Pages 自定义域、Rulesets，逐项复核上一轮变更是否留存，并评估剩余可优化项。

### 8.1 上一轮 6 项变更全部留存（无漂移）

| 项 | 当前值 | 状态 |
|---|---|---|
| ssl | strict | ✅ |
| always_use_https | on | ✅ |
| min_tls_version | 1.2 | ✅ |
| security_header | max-age=15552000 / includeSubDomains / nosniff，preload=false | ✅ |
| www 301 规则 | `(http.host eq "www.goodbye.help") → 301`，enabled | ✅ |
| Pages 自定义域 | 仅 `goodbye.help`、`startup.goodbye.help`、`www.startup.goodbye.help`（www 已不在其中） | ✅ |
| CAA | 本域 4 条 | ✅ |
| DNSSEC | pending，DS 未提交注册商 | ⏳ 待用户 |

### 8.2 本轮新增变更：Early Hints

```bash
curl -X PATCH ".../zones/$ZONE/settings/early_hints" -H "Content-Type: application/json" \
  -d '{"id":"early_hints","value":"on"}'
# 回滚：value 改回 "off"
```

依据：[Early Hints](https://developers.cloudflare.com/cache/advanced-configuration/early-hints/)（全套餐可用，仅 HTTP/2 与 HTTP/3 生效）。本站 HTTP/2 + HTTP/3 均开启，Pages 也原生支持 Early Hints。变更前 `off`，变更后 `on`，已回读确认。

> 说明：Early Hints 由源站返回的 `Link: ...; rel=preload` 头触发。当前 Pages 响应未带 Link 头，所以暂时观察不到 103 响应；开启后一旦上游加上 Link 头即刻生效，无副作用。

### 8.3 复核后判定「保持不动」的项（含理由）

| 设置 | 当前值 | 结论与理由 |
|---|---|---|
| Bot Fight Mode | 未开启（API 端点返回 not authorized，token 缺 Bot Management 读取权限） | **建议长期保持关闭**。官方明确它无法用 Skip 规则绕过、且会干扰合法自动化流量；本站 GEO 策略依赖 GPTBot / OAI-SearchBot / ClaudeBot / PerplexityBot 抓取，开启后这些未验证爬虫可能被挑战，直接损害被 AI 引擎引用的目标 |
| 托管 WAF 规则集 | Free Managed Ruleset（version 84） | 官方：Free 套餐**默认即部署**，无需也无法自定义，`waf=off` 只是遗留开关 |
| security_level | medium | 提高会误杀正常用户 |
| cache_level | aggressive | 官方合法枚举仅 aggressive/basic/simplified；`standard` 不存在（API 返回 1007） |
| edge_cache_ttl / browser_cache_ttl | 7200 / 14400 | 静态资源由 Pages 自带 `immutable` 头覆盖，改这两个值无收益 |
| minify | 全 off | 产物已预压缩；线上 minify 对 Next.js 有破坏 JS 的风险 |
| 0rtt | off | 官方提示重放风险 |
| rocket_loader | off | 会破坏 hydration |
| webp / polish / mirage / pseudo_ipv4 / orange_to_orange | off | 均为付费功能或已弃用能力，Free 无实际效果 |
| opportunistic_onion | on | 遗留 Tor 洋葱路由开关，对 .help 域无实际作用；无官方现行文档支撑，暂不盲改 |
| tls_1_2_only | off | 遗留开关，已被 min_tls_version=1.2 取代 |
| sort_query_string_for_cache | off（不可编辑） | 平台固定值 |

### 8.4 证书与链路复核

- 边缘证书：`universal` 覆盖 `goodbye.help` + `*.goodbye.help`，1 张 active、1 张 backup_issued
- `wise.goodbye.help` 在 strict 模式下返回 404（源站本就没有该路径），**无 526**，说明源站 Let's Encrypt 证书链路仍被认可

### 8.5 token 权限缺口（非阻塞）

`GET /zones/{zone}/bot_management` 返回 `request is not authorized`（HTTP 403 语义），说明当前 token 未包含 **Bot Management:Read**。只影响"读取 Bot Fight Mode 状态"这一项，不影响本轮任何写操作。若需要把该项纳入定期巡检，需为 token 补 **Zone Settings:Read/Edit、DNS:Read/Edit、Zone:Read、Pages:Read/Edit、Bot Management:Read**。

### 8.6 本轮后仍待决策（与第 5 节一致，未执行）

DNSSEC DS 提交注册商、DMARC 升 quarantine、startup 别名域去重、预览域索引治理、HSTS max-age 是否延长到 12 个月。
