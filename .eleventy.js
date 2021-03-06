const emojiRegex = require("emoji-regex");
const slugify = require("slugify");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const packageVersion = require("./package.json").version;
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const searchFilter = require("./src/filters/searchFilter");
const path = require('path');

module.exports = function (eleventyConfig) {
  eleventyConfig.setWatchJavaScriptDependencies(false);

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy({ "./assets": "" });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("packageVersion", () => `v${packageVersion}`);

  eleventyConfig.addFilter("searchByMunicipio", (municipio, data) => {
    return data.find((item) => {
      return item.id === municipio;
    });
  });

  eleventyConfig.addFilter("paginationSlice", (pagination) => {
    let pages = pagination.pages;
    let pageNumber = pagination.pageNumber;
    let start = pageNumber - 5;
    
    if (start < 0) {
      start = 0;
    }

    return pages.slice(start, pageNumber + 5);
  })

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    const regex = emojiRegex();
    // Remove Emoji first
    let string = str.replace(regex, "");

    return slugify(string, {
      lower: true,
      replacement: "-",
      remove: /[*+~·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addFilter("jsonTitle", (str) => {
    if (!str) {
      return;
    }
    let title = str.replace(/((.*)\s(.*)\s(.*))$/g, "$2&nbsp;$3&nbsp;$4");
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  eleventyConfig.addFilter("search", searchFilter);

  eleventyConfig.addFilter("realSlice", function(array, lenght) {
    return array.slice(0, lenght);
  });

  eleventyConfig.addFilter('toLocaleString', function(value) {
    let numero = parseFloat(value);

    if (Number.isNaN(numero)) {
      return '';
    }

    return numero.toLocaleString('lan');
  });

  eleventyConfig.addFilter('absolutePath', function(_path) {
    return path.join(__dirname, _path);
  });

  return {
    passthroughFileCopy: true,

    dir: {
      input: "src",
      output: "public",
    },
  };
};
