const fetch = require("node-fetch");
const flatcache = require("flat-cache");
const path = require("path");
const numeral = require('numeral');

function getCacheKey() {
  const date = new Date();
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

module.exports = async function() {
  const cache = flatcache.load("github-stargazers", path.resolve("./_datacache"));
  const key = getCacheKey();
  const cachedData = cache.getKey(key);

  if(!cachedData) {
    console.log( "Fetching new github stargazers count…" );

    // GitHub API: https://developer.github.com/v3/repos/#get
    const newData = await fetch("https://api.github.com/repos/GoogleChromeLabs/quicklink/")
      .then(res => res.json())
      .then(json => {
        const stargazers = numeral(json.stargazers_count).format('0,0');
        const forks = numeral(json.forks_count).format('0,0');

        return {
          stargazers,
          forks
        };
      });

    cache.setKey(key, newData);
    cache.save();
    return newData;
  }

  return cachedData;
};
