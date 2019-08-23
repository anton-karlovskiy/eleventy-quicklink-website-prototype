const markdownIt = require('markdown-it');
const purifycss = require('purify-css');
const htmlminifier = require('html-minifier');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

// docs: https://www.11ty.io/docs/config/
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/script.js");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addNunjucksFilter("markdown", function(string) {
    const md = new markdownIt();

    return md.render(string);
  });

  // TODO: does not seem to be working
  // eleventyConfig.addTransform('purifycss', async function(content, outputPath) {
  //   if (outputPath.endsWith(".html")) {
  //       return new Promise((resolve) => {
  //           purifycss(content, ['build/styles/main.css'], {
  //               minify: true
  //           }, (css) => {
  //               resolve(content.replace('<link rel="stylesheet" href="/styles/main.css">', `<style>${css}</style>`));
  //           });
  //       });
  //   };

  //   return content;
  // });

  eleventyConfig.addTransform('htmlminifier', async function(content, outputPath) {
    if (outputPath.endsWith(".html")) {
        return htmlminifier.minify(content, {
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            sortAttributes: true,
            sortClassName: true
        })
    };

    return content;
  });

  return {
    dir: {
      input: "src",
      output: "build"
    }
  };
};