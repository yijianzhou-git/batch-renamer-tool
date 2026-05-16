# GitHub Pages 部署指南

## 📋 部署清单

- [ ] 1. 在 GitHub 上创建仓库
- [ ] 2. 关联远程仓库
- [ ] 3. 推送代码
- [ ] 4. 配置 GitHub Pages
- [ ] 5. 等待部署完成
- [ ] 6. 测试访问

---

## 🚀 详细步骤

### 步骤 1：创建 GitHub 仓库

1. 访问 https://github.com
2. 点击右上角 "+" → "New repository"
3. 仓库名称：`batch-renamer-web`
4. 选择 Public（Public）
5. **不要**勾选 "Initialize this repository with a README
6. 点击 "Create repository"

### 步骤 2：关联并推送

在创建仓库页面，复制显示的命令是：

```bash
git remote add origin https://github.com/yijianzhou-git/batch-renamer-web.git
git branch -M main
git push -u origin main
```

请在命令行中执行这些命令（在 `F:\OpenClaw\web-tools\batch-renamer-web` 目录下）

### 步骤 3：配置 GitHub Pages

1. 进入仓库页面
2. 点击 "Settings" → "Pages"
3. 在 "Branch" 选择 "main"
4. 点击 "Save"

### 步骤 4：等待部署

等待 1-2 分钟，然后访问：

https://yijianzhou-git.github.io/batch-renamer-web/

---

## 📞 如果需要帮助？

如果遇到问题，请告诉我！
