# zhuld.github.io

个人主页 / 项目展示网站，基于 [Jekyll](https://jekyllrb.com/) 与 [Beautiful Jekyll](https://beautifuljekyll.com) 主题构建。

## 预览

访问：https://zhuld.github.io

## 功能特点

- 使用 **Beautiful Jekyll 6** 主题（`beautiful-jekyll-theme` gem），自带 Bootstrap 4 响应式布局、移动端汉堡菜单与页脚社交链接
- 项目列表**自动同步**自 GitHub：页面加载时调用 GitHub 公开 API 列出该账号的全部公开仓库，无需手工维护数据文件
- 项目名称链接到对应的 GitHub 仓库；已开启 GitHub Pages 的仓库（`has_pages` 为真）会在右侧显示「展示」图标，指向 `https://<用户名>.github.io/<仓库名>/`
- 项目列表自适应布局：窄屏单列，宽度 ≥ 768px 时显示两列（`assets/css/custom-styles.css` 中的 `.project-list` 网格 + 断点）
- 通过 GitHub Actions 自动构建并发布到 GitHub Pages

## 项目结构

```
zhuld.github.io/
├── _config.yml                    # 站点与主题配置（导航、配色、社交链接、插件等）
├── Gemfile                        # Ruby 依赖（jekyll、jekyll-remote-theme 及插件）
├── index.html                     # 首页（布局：home）
├── assets/
│   ├── js/projects.js             # 项目列表：调用 GitHub API 自动渲染
│   └── css/custom-styles.css      # 站点自定义样式（项目卡片）
└── .github/
    └── workflows/
        └── pages.yml              # GitHub Pages 构建与部署 workflow
```

主题通过 `_config.yml` 中的 `remote_theme: daattali/beautiful-jekyll@6.0.1` 引入（版本已固定），构建时自动拉取主题的 `_layouts`、`_includes`、`assets`，无需在仓库中维护；如需覆盖某个文件，可在仓库内新建同名文件。这种引入方式同时兼容 GitHub Pages 的「分支构建」与 GitHub Actions 构建。

升级主题：修改 `_config.yml` 中的版本号（例如 `@6.0.1` → 更新的 tag）即可。

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
| 增删/修改项目 | 直接增删 GitHub 仓库即可，页面自动同步（数据来源见 `assets/js/projects.js`） |
| 首页文案与结构 | `index.html` |
| 项目卡片等自定义样式 | `assets/css/custom-styles.css` |

### 项目列表的工作方式

- 用户名取自 `_config.yml` 的 `social-network-links.github`，修改该值即可切换同步的账号
- 会排除 **fork** 的仓库，以及用户主页仓库本身（`<用户名>.github.io`），其余公开仓库全部列出
- 按最近推送时间倒序排列；无描述时显示「暂无描述」
- 结果在 `sessionStorage` 中缓存 10 分钟，以减少未认证 API（每小时 60 次）的调用
- 若 API 不可用（如触发限流），页面会提示并给出 GitHub 主页链接；关闭 JavaScript 时通过 `<noscript>` 提示

> 说明：Pages 链接按 GitHub Pages 的默认规则拼接为 `https://<用户名>.github.io/<仓库名>/`；若某个仓库为 Pages 配置了自定义域名，GitHub 会自动从该地址跳转。

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/pages.yml`，推送 `main` 分支即自动构建部署：

1. 推送代码到 `main` 分支（或在 Actions 页面手动运行 `Deploy Jekyll site to Pages`）
2. workflow 使用 Ruby 3.3 + Bundler 构建，并上传产物到 GitHub Pages
3. 构建完成后即可访问 `https://zhuld.github.io`

> 若仓库 Settings → Pages 的 Source 仍是「Deploy from a branch」，该分支构建同样可以正常工作（主题使用 `remote_theme` 引入）；推荐改为 **GitHub Actions**，以获得完整的依赖版本控制。

### 项目仓库更新后自动部署

网站 workflow 也会在收到 `project_updated` 事件时重新生成项目列表并部署。要让项目仓库推送时立即发送此事件，需要在每个项目仓库中配置：

1. 创建一个仅授权 `zhuld/zhuld.github.io` 仓库、具有 **Contents: read and write** 权限的 fine-grained personal access token。
2. 在项目仓库的 **Settings → Secrets and variables → Actions** 中添加名为 `PROJECTS_DISPATCH_TOKEN` 的 repository secret，值为上一步创建的 token。
3. 在项目仓库添加 `.github/workflows/notify-website.yml`：

```yaml
name: Notify website

on:
  push:

permissions:
  contents: read

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger website update
        env:
          GH_TOKEN: ${{ secrets.PROJECTS_DISPATCH_TOKEN }}
        run: |
          curl --fail-with-body --request POST \
            --oauth2-bearer "$GH_TOKEN" \
            --url https://api.github.com/repos/zhuld/zhuld.github.io/dispatches \
            --header "Accept: application/vnd.github+json" \
            --header "X-GitHub-Api-Version: 2022-11-28" \
            --data '{"event_type":"project_updated"}'
```

配置完成后，每次推送到项目仓库都会触发网站更新。现有每日定时同步仍会保留，作为兜底。

## 协议

本项目基于 [MIT 协议](LICENSE) 开源；Beautiful Jekyll 主题同样以 MIT 协议发布。
