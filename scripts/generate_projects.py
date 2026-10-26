#!/usr/bin/env python3
"""在构建阶段从 GitHub API 拉取公开仓库列表，生成 _data/projects.json。

使用 GITHUB_TOKEN（由 Actions 提供）可避免未认证请求的速率限制。
"""

import json
import os
import sys
import urllib.request


def fetch_repos(user, token=None):
    repos = []
    page = 1
    while True:
        url = (
            "https://api.github.com/users/{}/repos"
            "?type=public&per_page=100&sort=pushed&page={}".format(user, page)
        )
        req = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json"})
        if token:
            req.add_header("Authorization", "Bearer " + token)
        with urllib.request.urlopen(req) as resp:
            batch = json.load(resp)
        if not batch:
            break
        repos.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return repos


def normalize(user, repos):
    profile_repo = (user + ".github.io").lower()
    base = "https://" + user.lower() + ".github.io"

    def pages_url(name):
        if name.lower() == profile_repo:
            return base + "/"
        return base + "/" + name + "/"

    projects = []
    for repo in repos:
        if repo.get("fork"):
            continue
        projects.append(
            {
                "name": repo["name"],
                "description": repo.get("description"),
                "url": repo["html_url"],
                "pages": pages_url(repo["name"]) if repo.get("has_pages") else None,
                "pushed_at": repo.get("pushed_at"),
            }
        )
    projects.sort(key=lambda p: p.get("pushed_at") or "", reverse=True)
    for p in projects:
        p.pop("pushed_at", None)
    return projects


def main():
    user = os.environ.get("GITHUB_USER") or (sys.argv[1] if len(sys.argv) > 1 else None)
    if not user:
        print("GITHUB_USER not provided", file=sys.stderr)
        sys.exit(1)
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    out_path = os.environ.get("OUTPUT", "_data/projects.json")

    repos = fetch_repos(user, token)
    projects = normalize(user, repos)

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print("Generated {} projects -> {}".format(len(projects), out_path))


if __name__ == "__main__":
    main()