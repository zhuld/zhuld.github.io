source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "minima", "~> 2.5"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
end

# Windows 上需要 tzinfo-data 提供时区数据
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"

  # 监听文件变化
  gem "wdm", "~> 0.2"
end
gem "webrick", "~> 1.8"
