/*
 * 首页项目列表：从 GitHub 公开 API 自动同步该账号下的公开仓库。
 * 仓库启用 GitHub Pages 时，在名称右侧显示「展示」图标（外链样式）。
 */
(function () {
  "use strict";

  // 10 分钟内复用上次结果，减少对 GitHub API 的调用（未认证请求每小时 60 次）
  var CACHE_TTL = 10 * 60 * 1000;

  var DEMO_ICON =
    '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">' +
    '<path d="M9 2.6H4A1.6 1.6 0 0 0 2.4 4.2v7.6A1.6 1.6 0 0 0 4 13.4h7.6a1.6 1.6 0 0 0 1.6-1.6V7.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M10.6 2.4H14v3.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M14 2.4 8.4 8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
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
    if (text !== undefined) {
      node.textContent = text;
    }
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

    var head = createElement("div", "project-head");

    var name = createElement("a", "project-name", project.name);
    name.href = project.url;
    name.target = "_blank";
    name.rel = "noopener noreferrer";
    head.appendChild(name);

    if (project.pages) {
      var demo = createElement("a", "project-demo");
      demo.href = project.pages;
      demo.target = "_blank";
      demo.rel = "noopener";
      demo.title = "展示";
      demo.setAttribute("aria-label", project.name + " 展示");
      demo.innerHTML = DEMO_ICON;
      head.appendChild(demo);
    }

    item.appendChild(head);
    item.appendChild(createElement("p", "project-desc", project.description || "暂无描述"));

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
