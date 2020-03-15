/* eslint-disable global-require */

describe('getRepoParams', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return owner and repo from environment variables by default', async () => {
    process.env.OWNER = 'testOWNER';
    process.env.REPO = 'testRepo';
    jest.mock('execa', () => async () => ({
      stdout: '121231257615356124',
    }));
    jest.mock('env-ci', () => () => ({}));
    const getRepoParams = require('./getRepoParams');
    const params = await getRepoParams();
    expect(params).toMatchObject({
      owner: process.env.OWNER,
      repo: process.env.REPO,
    });
  });
  it('should return owner and repo from slug', async () => {
    jest.mock('execa', () => async () => ({
      stdout: '121231257615356124',
    }));
    jest.mock('env-ci', () => () => ({
      slug: 'slugOwner/slugRepo',
    }));
    const getRepoParams = require('./getRepoParams');
    const params = await getRepoParams();
    expect(params).toMatchObject({
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
    expect(params).toMatchObject({
      owner: 'gitOwner',
      repo: 'gitRepo',
    });
  });
  it('should return baseUrl when process.env.GH_API is set', async () => {
    process.env.GH_API = 'GH_API.com';
    const getRepoParams = require('./getRepoParams');
    const params = await getRepoParams();
    expect(params.baseUrl).toBe(process.env.GH_API);
  });
  it('should return baseUrl when process.env.GITHUB_URL is set', async () => {
    delete process.env.GH_API;
    process.env.GITHUB_URL = 'GITHUB_URL.com';
    const getRepoParams = require('./getRepoParams');
    const params = await getRepoParams();
    expect(params.baseUrl).toBe(process.env.GITHUB_URL);
  });
  it('should return baseUrl of https://api.github.com when no envs are set', async () => {
    delete process.env.GH_API;
    delete process.env.GITHUB_URL;
    const getRepoParams = require('./getRepoParams');
    const params = await getRepoParams();
    expect(params.baseUrl).toBe('https://api.github.com');
  });
});
