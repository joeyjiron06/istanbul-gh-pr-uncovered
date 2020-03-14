const nock = require('nock');
const getUncoveredLines = require('./index');
const coverageMap = require('../testFixtures/coverageMap.json');
const ghPRFiles = require('../testFixtures/ghPRFiles-full.json');
const { appId, privateKey } = require('../testFixtures/ghAppCreds');

const GH_API = 'https://api.github.com';

describe('getUncoveredLines', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return an empty array when no coverageMap is in testResults', async () => {
    const uncoveredLines = await getUncoveredLines({});
    expect(uncoveredLines).toEqual([]);
  });
  it('should return an empty array when uncovered lines is empty ', async () => {
    const pullRequestNumber = 123;
    const repoId = 12222;

    nock(GH_API)
      .get(new RegExp('/repos/.*/installation'))
      .reply(200, {
        id: repoId,
      });

    nock(GH_API)
      .post(`/app/installations/${repoId}/access_tokens`)
      .reply(200, {});

    nock(GH_API)
      .get(new RegExp('/repos/.*/pulls'))
      .query(true)
      .reply(200, [{
        number: pullRequestNumber,
      }]);

    nock(GH_API)
      .get(new RegExp(`/repos/.*/pulls/${pullRequestNumber}/files`))
      .reply(200, [
        {
          sha: '3faebd61e742c528445ae4aa708e3db3b879e3e6',
          filename: 'src/routes/index.js',
          status: 'modified',
          additions: 4,
          deletions: 0,
          changes: 4,
          blob_url: 'https://lpgithub.dev.lprnd.net/Core-AI/lp-mavenask-app/blob/ee524731e2158996b8ef8c17523dfab59d4e5ed7/src/routes/index.js',
          raw_url: 'https://lpgithub.dev.lprnd.net/Core-AI/lp-mavenask-app/raw/ee524731e2158996b8ef8c17523dfab59d4e5ed7/src/routes/index.js',
          contents_url: 'https://lpgithub.dev.lprnd.net/api/v3/repos/Core-AI/lp-mavenask-app/contents/src/routes/index.js?ref=ee524731e2158996b8ef8c17523dfab59d4e5ed7',
          patch: "@@ -14,6 +14,10 @@ router.get('/v1/account/:accountId/next-actions'",
        },
      ]);

    const uncoveredLines = await getUncoveredLines({
      coverageMap,
      appId,
      privateKey,
    });
    expect(uncoveredLines).toEqual([]);
  });


  it('should return an array of the uncovered lines from the test results', async () => {
    const pullRequestNumber = 123;
    const repoId = 12222;

    nock(GH_API)
      .get(new RegExp('/repos/.*/installation'))
      .reply(200, {
        id: repoId,
      });

    nock(GH_API)
      .post(`/app/installations/${repoId}/access_tokens`)
      .reply(200, {});

    nock(GH_API)
      .get(new RegExp('/repos/.*/pulls'))
      .query(true)
      .reply(200, [{
        number: pullRequestNumber,
      }]);

    nock(GH_API)
      .get(new RegExp(`/repos/.*/pulls/${pullRequestNumber}/files`))
      .reply(200, ghPRFiles);


    const uncoveredLines = await getUncoveredLines({
      coverageMap,
      appId,
      privateKey,
    });
    expect(uncoveredLines).toEqual([
      {
        filename: 'src/routes/index.js',
        lines: [18],
      },
    ]);
  });

  it('should return an empty array when not in a CI environment', async () => {
    delete process.env.CI;

    const uncoveredLines = await getUncoveredLines({
      coverageMap,
      appId,
      privateKey,
    });

    expect(uncoveredLines).toEqual([]);
  });
});
