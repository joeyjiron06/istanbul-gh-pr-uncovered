const { Octokit } = require('@octokit/rest');
const { App } = require('@octokit/app');
const envCi = require('env-ci');
const parseFilePatch = require('git-file-patch-parser');
const getRepoParams = require('./getRepoParams');

const env = envCi();


async function authenticate({ appId, privateKey }) {
  const { owner, repo, baseUrl } = await getRepoParams();

  const app = new App({
    id: appId,
    privateKey,
    baseUrl,
  });

  const octokit = new Octokit({
    auth: app.getSignedJsonWebToken(),
    baseUrl,
  });

  const response = await octokit.apps.getRepoInstallation({
    owner,
    repo,
  });

  const token = await app.getInstallationAccessToken({
    installationId: response.data.id,
  });

  return new Octokit({ auth: token, baseUrl });
}


async function fetchPRNumner(octokit) {
  const { owner, repo } = await getRepoParams();

  const prListResponse = await octokit.pulls.list({
    owner,
    repo,
    head: env.commit,
    state: 'open',
    per_page: 1,
    page: 0,
  });

  return prListResponse.data[0].number;
}


async function fetchPrFiles(octokit, pullRequestNumber) {
  const { owner, repo } = await getRepoParams();

  const prResponse = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pullRequestNumber,
  });

  return prResponse.data.map((file) => {
    const lines = parseFilePatch(file.patch);

    return {
      filename: file.filename,
      lines,
    };
  });
}

/**
 * @return {GHPRFile[]} An array of github pr files with the diff.
 */
module.exports = async ({ appId, privateKey }) => {
  const octokit = await authenticate({ appId, privateKey });

  const pullRequestNumber = await fetchPRNumner(octokit);
  const files = await fetchPrFiles(octokit, pullRequestNumber);

  return files;
};
