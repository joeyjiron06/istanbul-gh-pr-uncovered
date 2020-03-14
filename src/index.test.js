const index = require('./index');

describe('index', () => {
  it('should return a string', () => {
    expect(index()).toBe('hello package!');
  });
});
