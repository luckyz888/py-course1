# Cloudflare Pages 部署指南

## 构建配置

| 配置项 | 值 |
|--------|-----|
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node.js 版本 | 18+ |
| 环境变量 | 无 |

## 部署步骤

### 1. 通过 Git 仓库部署（推荐）

1. 将项目推送到 GitHub / GitLab / Bitbucket 仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. 进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
4. 选择仓库，填入构建配置：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. 点击 **Save and Deploy**

### 2. 通过 CLI 直接部署

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录
wrangler login

# 部署
npx wrangler pages deploy dist --project-name=数据分析在线平台
```

## 自定义域名（可选）

1. 在 Cloudflare Pages 项目设置中进入 **Custom domains**
2. 添加自定义域名
3. 按照提示在域名 DNS 中添加 CNAME 记录指向 Cloudflare

## 架构说明

- **Monaco Editor**: 通过 `@monaco-editor/react` 从 CDN (`cdn.jsdelivr.net`) 加载，不包含在构建产物中
- **Pyodide**: 通过动态 `<script>` 标签从 CDN (`cdn.jsdelivr.net/pyodide`) 加载，不包含在构建产物中
- **SPA 路由**: `public/_redirects` 确保所有路径回退到 `index.html`
- **安全头**: `public/_headers` 配置了 X-Frame-Options、X-Content-Type-Options 等安全头
- **缓存策略**: `/assets/*` 长期缓存（1年 + immutable），HTML 文件不缓存

## 常见问题

### 页面刷新后 404

确认 `dist/_redirects` 文件存在且内容为 `/*    /index.html   200`。

### Monaco Editor 加载失败

Monaco Editor 从 CDN 加载，确保用户网络可以访问 `cdn.jsdelivr.net`。

### Pyodide 加载缓慢

Pyodide 运行时约 20MB，首次加载较慢属于正常现象。后续访问会使用浏览器缓存。

### 构建产物过大

当前构建产物约 560KB（gzip 后约 175KB），不包含 Monaco Editor 和 Pyodide 源码。如果需要进一步优化，可考虑：
- 按路由懒加载页面组件
- 压缩图片资源
