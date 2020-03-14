/* eslint-disable global-require */

describe('getRepoParams', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return owner and repo from environment variables by default', async () => {
    process.env.OWNER = 'testOWNER';
    process.env.REPO = 'testRepo';
    const getRepoParams = require('./getRepoParams');
    const params = await getRepoParams();
    expect(params).toEqual({
      owner: process.env.OWNER,
      repo: process.env.REPO,
    });
  });
  it('should return owner and repo from slug', async () => {
    jest.mock('env-ci', () => () => ({
      slug: 'slugOwner/slugRepo',
    }));
    const getRepoParams = require('./getRepoParams');
    const params = await getRepoParams();
    expect(params).toEqual({
      owner: 'slugOwner',
      repo: 'slugRepo',
    });
  });
  it('should return owner and repo git command', async () => {
    jest.mock('execa', () => async () => ({
      stdout: 'https://github.com/gitOwner/gitRepo.git',
    }));
    const getRepoParams = require('./getRepoParams');
    const params = await getRepoParams();
    expect(params).toEqual({
      owner: 'gitOwner',
      repo: 'gitRepo',
    });
  });
});
