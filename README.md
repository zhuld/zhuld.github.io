# zhuld.github.io

个人主页 / 项目展示网站，基于 [Jekyll](https://jekyllrb.com/) 与 [Beautiful Jekyll](https://beautifuljekyll.com) 主题构建。

## 预览

访问：https://zhuld.github.io

## 功能特点

- 使用 **Beautiful Jekyll 6** 主题（`beautiful-jekyll-theme` gem），自带 Bootstrap 4 响应式布局、移动端汉堡菜单与页脚社交链接
- 项目列表数据驱动（`_data/projects.yml`，修改数据无需改 HTML）
- 通过 GitHub Actions 自动构建并发布到 GitHub Pages

## 项目结构

```
zhuld.github.io/
├── _config.yml                    # 站点与主题配置（导航、配色、社交链接、插件等）
├── Gemfile                        # Ruby 依赖（jekyll、beautiful-jekyll-theme 及插件）
├── index.html                     # 首页（布局：home）
├── _data/
│   └── projects.yml               # 项目数据（名称、描述、链接、GitHub 仓库）
├── assets/
│   └── css/custom-styles.css      # 站点自定义样式（项目卡片）
└── .github/
    └── workflows/
        └── pages.yml              # GitHub Pages 构建与部署 workflow
```

主题的 `_layouts`、`_includes`、`assets` 由 gem 提供，无需在仓库中维护；如需覆盖，可在仓库内新建同名文件。

## 本地运行

### 前提条件

安装 [Ruby](https://rubyinstaller.org/)（Windows）或使用系统包管理器安装 Ruby，然后安装 Bundler：

```bash
gem install bundler
```

### 启动开发服务器

```bash
bundle install
bundle exec jekyll serve
```

浏览器访问 `http://localhost:4000` 即可查看。

### 构建生产文件

```bash
bundle exec jekyll build
```

生成的静态文件位于 `_site/` 目录。

## 自定义内容

| 要修改的内容 | 操作文件 |
|-------------|---------|
| 站点标题、作者、URL、语言 | `_config.yml` |
| 导航栏链接 | `_config.yml` 中的 `navbar-links` |
| 页脚社交链接 | `_config.yml` 中的 `social-network-links` |
| 主题配色 | `_config.yml` 中的 `page-col`、`navbar-col`、`footer-col` 等 |
| 增删/修改项目 | `_data/projects.yml` |
| 首页文案与结构 | `index.html` |
| 项目卡片等自定义样式 | `assets/css/custom-styles.css` |

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/pages.yml`，推送 `main` 分支即自动构建部署：

1. workflow 首次运行时会自动把 Pages 发布方式切换为 **GitHub Actions**（仓库原先的「分支构建」模式使用固定 gem 集合，无法加载 Beautiful Jekyll 主题）
2. 推送代码到 `main` 分支（或在 Actions 页面手动运行 `Deploy Jekyll site to Pages`）
3. workflow 构建完成后即可访问 `https://zhuld.github.io`

## 协议

本项目基于 [MIT 协议](LICENSE) 开源；Beautiful Jekyll 主题同样以 MIT 协议发布。

---

Made with ❤️ by zhuld
