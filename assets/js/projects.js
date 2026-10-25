/*
 * 首页项目列表：从 GitHub 公开 API 自动同步该账号下的公开仓库。
 * 仓库启用 GitHub Pages 时，额外显示在线演示链接。
 */
(function () {
  "use strict";

  // 10 分钟内复用上次结果，减少对 GitHub API 的调用（未认证请求每小时 60 次）
  var CACHE_TTL = 10 * 60 * 1000;

  var GITHUB_ICON =
    '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>' +
    "</svg>";

  var list = document.getElementById("project-list");
  if (!list) {
    return;
  }

  var user = list.getAttribute("data-github-user");
  if (!user) {
    return;
  }

  var profileRepo = (user + ".github.io").toLowerCase();
  var cacheKey = "gh-projects:" + user.toLowerCase();

  function pagesUrl(repoName) {
    var base = "https://" + user.toLowerCase() + ".github.io";
    return repoName.toLowerCase() === profileRepo ? base + "/" : base + "/" + repoName + "/";
  }

  function readCache() {
    try {
      var cached = JSON.parse(window.sessionStorage.getItem(cacheKey) || "null");
      if (cached && Date.now() - cached.time < CACHE_TTL) {
        return cached.projects;
      }
    } catch (e) {
      /* sessionStorage 不可用时忽略缓存 */
    }
    return null;
  }

  function writeCache(projects) {
    try {
      window.sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), projects: projects }));
    } catch (e) {
      /* sessionStorage 不可用时忽略缓存 */
    }
  }

  function createElement(tag, className, text) {
    var node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function showMessage(text, isError, linkHref, linkLabel) {
    list.innerHTML = "";
    var item = createElement("li", "project-status" + (isError ? " project-status-error" : ""), text);
    if (linkHref) {
      var link = createElement("a", "project-status-link", linkLabel);
      link.href = linkHref;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      item.appendChild(document.createTextNode(" "));
      item.appendChild(link);
    }
    list.appendChild(item);
  }

  function renderItem(project) {
    var item = createElement("li", "project-item");

    var name = createElement("a", "project-name", project.name);
    name.href = project.pages || project.url;
    name.target = "_blank";
    name.rel = "noopener";
    item.appendChild(name);

    item.appendChild(createElement("p", "project-desc", project.description || "暂无描述"));

    if (project.pages) {
      var meta = createElement("div", "project-meta");
      var pages = createElement("a", "project-badge", "演示");
      pages.href = project.pages;
      pages.target = "_blank";
      pages.rel = "noopener";
      pages.title = project.pages;
      meta.appendChild(pages);
      item.appendChild(meta);
    }

    var github = document.createElement("a");
    github.className = "project-github";
    github.href = project.url;
    github.target = "_blank";
    github.rel = "noopener noreferrer";
    github.setAttribute("aria-label", project.name + " 的 GitHub 仓库");
    github.innerHTML = GITHUB_ICON;
    item.appendChild(github);

    return item;
  }

  function normalize(repos) {
    return repos
      .filter(function (repo) {
        // 排除 fork 与站点仓库本身，只保留本人的公开项目
        return !repo.fork && repo.name.toLowerCase() !== profileRepo;
      })
      .sort(function (a, b) {
        return new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0);
      })
      .map(function (repo) {
        return {
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          pages: repo.has_pages ? pagesUrl(repo.name) : null
        };
      });
  }

  function render(projects) {
    if (!projects.length) {
      showMessage("暂无公开项目。");
      return;
    }
    list.innerHTML = "";
    projects.forEach(function (project) {
      list.appendChild(renderItem(project));
    });
  }

  function load() {
    var cached = readCache();
    if (cached) {
      render(cached);
      return;
    }

    showMessage("正在加载项目列表…");

    fetch("https://api.github.com/users/" + encodeURIComponent(user) + "/repos?per_page=100&sort=pushed", {
      headers: { Accept: "application/vnd.github+json" }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("GitHub API " + response.status);
        }
        return response.json();
      })
      .then(function (repos) {
        var projects = normalize(repos);
        writeCache(projects);
        render(projects);
      })
      .catch(function (error) {
        showMessage(
          "项目列表加载失败（" + error.message + "），请稍后刷新，或直接访问",
          true,
          "https://github.com/" + user,
          "GitHub 主页"
        );
      });
  }

  load();
})();
