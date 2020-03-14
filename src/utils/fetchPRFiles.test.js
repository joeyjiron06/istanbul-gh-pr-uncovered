process.env.OWNER = 'test';
process.env.REPO = 'test';
process.env.GH_API = 'https://api.github.com';

const nock = require('nock');
const fetchPRFiles = require('./fetchPRFiles');
const ghPrFiles = require('../../testFixtures/ghPRFiles-short.json');
const { appId, privateKey } = require('../../testFixtures/ghAppCreds');

const { OWNER, REPO } = process.env;

describe('fetchPRFiles', () => {
  it('should return the pr files when all gh apis succeed', async () => {
    const pullRequestNumber = 123;
    const repoId = 12222;

    nock(process.env.GH_API)
      .get(`/repos/${OWNER}/${REPO}/installation`)
      .reply(200, {
        id: repoId,
      });

    nock(process.env.GH_API)
      .post(`/app/installations/${repoId}/access_tokens`)
      .reply(200, {});

    nock(process.env.GH_API)
      .get(`/repos/${OWNER}/${REPO}/pulls`)
      .query(true)
      .reply(200, [{
        number: pullRequestNumber,
      }]);

    nock(process.env.GH_API)
      .get(`/repos/${OWNER}/${REPO}/pulls/${pullRequestNumber}/files`)
      .reply(200, ghPrFiles);


    const files = await fetchPRFiles({ appId, privateKey });

    expect(files).toEqual([
      {
        filename: 'package.json',
        lines: [
          {
            modification: 'deleted',
            lineNumber: 15,
            line: '    "ci_flow": "ci_flow --no-systest --no-publish",',
          },
          {
            modification: 'added',
            lineNumber: 15,
            line: '    "ci_flow": "node ./test/getPullRequestLinesAdded.js",',
          },
          {
            modification: 'added',
            lineNumber: 36,
            line: '    "git-patch-additions": "^1.0.1",',
          },
          {
            modification: 'added',
            lineNumber: 46,
            line: '    "parse-diff": "^0.7.0",',
          },
          {
            modification: 'added',
            lineNumber: 56,
            line: '    "git-patch-parser": "^0.2.1",',
          },
          {
            modification: 'deleted',
            lineNumber: 59,
            line: '    "pino": "^5.12.0"',
          },
          {
            modification: 'added',
            lineNumber: 62,
            line: '    "pino": "^5.12.0",',
          },
          {
            modification: 'added',
            lineNumber: 63,
            line: '    "simple-git": "^1.132.0"',
          },
          {
            modification: 'deleted',
            lineNumber: 61,
            line: '}',
          },
          {
            modification: 'added',
            lineNumber: 66,
            line: '}',
          },
        ],
      },
    ]);
  });
});
