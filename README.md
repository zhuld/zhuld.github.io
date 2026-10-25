# zhuld.github.io

个人主页 / 项目展示网站，基于 [Jekyll](https://jekyllrb.com/) 与 [Minima](https://github.com/jekyll/minima) 主题构建。

## 预览

访问：https://zhuld.github.io

## 功能特点

- 使用 Jekyll 官方 **minima** 主题，布局、导航、页脚、SEO 与 RSS 均由主题与插件提供
- 响应式布局，自动适配移动端
- 项目列表数据驱动（`_data/projects.yml`，修改数据无需改 HTML）
- 通过 GitHub Actions 自动构建并发布到 GitHub Pages

## 项目结构

```
zhuld.github.io/
├── _config.yml             # Jekyll 全站配置（主题、插件、站点信息）
├── Gemfile                 # Ruby 依赖（jekyll、minima 及插件）
├── index.html              # 首页（使用 minima 的 home 布局）
├── _data/
│   └── projects.yml        # 项目数据（名称、描述、链接、GitHub 仓库）
├── assets/
│   └── main.scss           # 在 minima 样式基础上的少量自定义（hero、项目列表）
└── .github/
    └── workflows/
        └── pages.yml       # GitHub Pages 构建与部署 workflow
```

主题的 `_layouts`、`_includes`、`_sass` 由 minima gem 提供，无需在仓库中维护；如需覆盖，可在本地新建同名文件。

## 本地运行

### 前提条件

安装 [Ruby](https://rubyinstaller.org/)（Windows）或使用系统包管理器安装 Ruby，然后安装 Bundler：

```bash
gem install bundler
```

### 启动开发服务器

```bash
# 安装依赖
bundle install

# 启动本地服务器
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
| 站点标题、描述、作者、网址 | `_config.yml` |
| 增删/修改项目 | `_data/projects.yml` |
| 首页文案与结构 | `index.html` |
| 主题样式微调 | `assets/main.scss` |

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/pages.yml`，推送 `main` 分支即自动构建部署：

1. 在仓库 **Settings → Pages → Build and deployment** 中将 **Source** 设为 **GitHub Actions**
2. 推送代码到 `main` 分支（或在 Actions 页面手动运行 `Deploy Jekyll site to Pages`）
3. workflow 构建完成后即可访问 `https://zhuld.github.io`

## 协议

本项目基于 [MIT 协议](LICENSE) 开源。

---

Made with ❤️ by zhuld
