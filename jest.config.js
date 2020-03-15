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
  reporters: [
    'default',
    ['jest-github-reporter', { failOnUncoveredLines: true }],
  ],
  globalSetup: '<rootDir>/globalSetup.js',
};
