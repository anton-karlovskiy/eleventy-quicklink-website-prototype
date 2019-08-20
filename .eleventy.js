const moment = require('moment-timezone');
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

  // TODO: not confirmed if this filter might be needed
  eleventyConfig.addNunjucksFilter("date", function(date, format = "YYYY-MM-DD") {
    return moment(date).format(format);
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

  // TODO: commented out while dev
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
    // ray test touch <
    templateFormats: [
      "njk",
      "md"
    ],

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    // ray test touch >

    dir: {
      input: "src",
      output: "build"
    }
  };
};