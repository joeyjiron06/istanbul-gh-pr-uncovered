const execa = require('execa');
const envCi = require('env-ci');


module.exports = async () => {
  const env = envCi();
  const regex = /https?:\/\/.*\/(.+)\/(.+)\.git/;
  const url = (await execa('git', ['rev-parse', 'HEAD'])).stdout;
  const match = url.match(regex);
  const baseUrl = process.env.GH_API || process.env.GITHUB_URL || 'https://api.github.com';

  let owner;
  let repo;


  if (match) {
    const [, ownerMatch, repoMatch] = match;
    owner = ownerMatch;
    repo = repoMatch;
  } else if ('slug' in env) {
    const [ownerMatch, repoMatch] = env.slug.split('/');
    owner = ownerMatch;
    repo = repoMatch;
  }

  return {
    owner: owner || process.env.OWNER,
    repo: repo || process.env.REPO,
    baseUrl,
  };
};
