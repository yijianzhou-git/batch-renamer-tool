# 批量文件重命名工具 - 部署指南

## 🎯 项目概述

这是一个在线批量文件重命名工具，采用按次付费模式（¥0.5/次），适合运营赚钱。

## 📁 项目结构

```
batch-renamer-web/
├── index.html          # 主页面（已优化SEO）
├── style.css           # 样式文件
├── app.js              # 交互逻辑
├── sitemap.xml         # 站点地图（新增）
├── robots.txt          # 爬虫协议（新增）
├── thumbnail.jpg       # 缩略图（建议添加）
├── apple-touch-icon.png # Apple图标（建议添加）
└── DEPLOY.md           # 部署说明
```

## 🚀 部署方式

### 方式一：GitHub Pages（免费）

1. 创建 GitHub 仓库，命名为 `yourusername.github.io`
2. 将文件上传到仓库
3. 进入仓库 Settings -> Pages
4. 选择 main 分支，点击保存
5. 访问 `https://yourusername.github.io`

**注意**：如果使用项目仓库（非用户名仓库），需要在仓库设置中设置正确的路径。

### 方式二：腾讯云 CloudBase（国内访问快）

1. 注册腾讯云账号
2. 进入 CloudBase 控制台
3. 创建云开发环境
4. 进入静态网站托管
5. 上传文件
6. 获取访问链接

### 方式三：传统服务器

```bash
# 安装 Nginx
sudo apt update && sudo apt install nginx

# 复制文件
sudo cp -r batch-renamer-web /var/www/

# 配置 Nginx
sudo nano /etc/nginx/sites-available/batch-renamer
```

Nginx 配置示例：
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    root /var/www/batch-renamer-web;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 启用 gzip 压缩
    gzip on;
    gzip_types text/html text/css application/javascript;
}
```

## 🔍 SEO优化指南

### 已完成的优化

1. **Meta标签优化**
   - 标题：包含核心关键词"批量文件重命名工具"
   - 描述：详细描述工具功能和优势
   - 关键词：包含相关搜索词

2. **结构化数据**
   - 添加 Schema.org 标记
   - 定义为 WebApplication 类型
   - 包含功能列表

3. **Open Graph 标签**
   - 支持社交媒体分享
   - 包含标题、描述、图片

4. **站点地图**
   - 创建 sitemap.xml
   - 定义页面优先级和更新频率

5. **爬虫协议**
   - 创建 robots.txt
   - 允许所有爬虫访问

### 需要手动完成的优化

1. **Google Search Console**
   - 访问 https://search.google.com/search-console
   - 添加站点并验证
   - 提交 sitemap.xml

2. **Google Analytics**
   - 访问 https://analytics.google.com
   - 创建账号和属性
   - 获取跟踪ID并替换 index.html 中的占位符

3. **验证文件**
   - 在 Google Search Console 中下载验证文件
   - 上传到网站根目录

4. **添加缩略图**
   - 创建 1200x630 像素的缩略图
   - 命名为 thumbnail.jpg 放在根目录

## 💰 支付集成

### 微信支付

1. 注册微信商户号
2. 创建支付 API 密钥
3. 修改 app.js 中的支付逻辑

### 支付宝

1. 注册支付宝商户号
2. 创建应用
3. 集成支付 SDK

### 当前方案（二维码收款）

当前使用二维码收款方式，无需企业账号，个人即可使用。
- 将收款二维码保存为 qrcode.jpg
- 放在项目根目录

## 📊 运营建议

### 定价策略

| 方案 | 价格 | 适用场景 |
|------|------|----------|
| 单次付费 | ¥0.5/次 | 偶尔使用 |
| 套餐A | ¥5/12次 | 轻度用户 |
| 套餐B | ¥15/40次 | 中度用户 |
| 套餐C | ¥30/100次 | 重度用户 |

### 流量获取

1. **SEO优化**：标题包含"批量重命名"、"文件重命名工具"等关键词
2. **小红书推广**：发布工具使用教程
3. **知乎回答**：回答相关问题并推荐工具
4. **微信群推广**：分享到工具类、办公技巧类群
5. **百度经验**：发布使用教程

### 用户留存

1. 注册送免费次数
2. 邀请好友送次数
3. 关注公众号获取优惠

## 🛠️ 技术升级

### 添加功能

- [ ] 批量下载（需要 JSZip 库）
- [ ] 历史记录
- [ ] 用户账户系统
- [ ] 会员订阅

### 性能优化

- [ ] 文件大小限制
- [ ] 压缩文件上传
- [ ] CDN 加速

## 📈 收益预估

假设每日 100 次使用：
- 单次付费：100 × ¥0.5 = ¥50/天 = ¥1500/月
- 套餐用户：额外收入

## 📝 更新日志

### v1.0.0
- 基础功能完成
- 支持前缀、后缀、序号、日期、替换
- 预览功能
- 支付弹窗

### v1.1.0（计划）
- 批量下载
- 用户系统
- 会员套餐

### v1.2.0（计划）
- SEO优化完成
- 站点地图和爬虫协议
- 结构化数据

## 📞 联系方式

如有问题，欢迎联系！