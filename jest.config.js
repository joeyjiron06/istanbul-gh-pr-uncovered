module.exports = {
  rootDir: './',
  testMatch: [
    '<rootDir>/src/**/*.test.js',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!<rootDir>/src/**/*.test.js',
  ],
  globalSetup: '<rootDir>/globalSetup.js',
};
