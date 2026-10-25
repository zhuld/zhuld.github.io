# zhuld.github.io

个人主页 / 项目展示网站，基于 [Jekyll](https://jekyllrb.com/) 构建，使用磨砂玻璃（Glassmorphism）设计风格。

## 预览

访问：https://zhuld.github.io

## 功能特点

- 响应式布局，支持移动端汉堡菜单
- 磨砂玻璃视觉效果（backdrop-filter）
- 平滑滚动与导航高亮
- 项目列表数据驱动（`_data/projects.yml`，修改数据无需改 HTML）
- 基于 Jekyll，易于部署到 GitHub Pages

## 项目结构

```
zhuld.github.io/
├── _config.yml           # Jekyll 全站配置
├── index.html            # 首页（使用 default 布局）
├── _data/
│   └── projects.yml      # 项目数据（名称、描述、链接、GitHub 仓库）
├── _includes/
│   ├── header.html       # 顶部导航（可复用片段）
│   ├── footer.html       # 底部版权（可复用片段）
│   └── github-icon.html  # GitHub 图标 SVG
├── _layouts/
│   └── default.html      # 基础布局（head / header / content / footer / script）
└── assets/
    ├── css/main.css      # 样式表
    └── js/main.js        # 交互脚本（汉堡菜单、平滑滚动等）
```

## 本地运行

### 前提条件

确保已安装 [Ruby](https://www.ruby-lang.org/en/downloads/) 与 [Jekyll](https://jekyllrb.com/docs/installation/)：

```bash
gem install jekyll bundler
```

### 启动开发服务器

```bash
# 进入项目目录
cd zhuld.github.io

# 安装依赖（如有 Gemfile）
bundle install

# 启动本地服务器
bundle exec jekyll serve
```

浏览器访问 `http://localhost:4000` 即可查看。

### 构建生产文件

```bash
bundle exec jekyll build
```

生成的静态文件位于 `_site/` 目录，可直接部署到 GitHub Pages 或任何静态托管平台。

## 自定义内容

| 要修改的内容 | 操作文件 |
|-------------|---------|
| 站点标题、描述、作者、网址 | `_config.yml` |
| 增删/修改项目 | `_data/projects.yml` |
| 页面整体布局 | `_layouts/default.html` |
| 顶部导航 / 底部版权 | `_includes/header.html`、`_includes/footer.html` |
| 样式 | `assets/css/main.css` |
| 交互脚本 | `assets/js/main.js` |

## 部署到 GitHub Pages

1. 将代码推送到 `username.github.io` 仓库的 `main` 分支
2. 在仓库设置中启用 GitHub Pages（Source 选择 `main` 分支 / `/root`）
3. 等待几分钟后即可访问 `https://username.github.io`

## 协议

本项目基于 [MIT 协议](LICENSE) 开源。

---

Made with ❤️ by zhuld
