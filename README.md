# istanbul-gh-pr-uncovered

![Build Status](https://github.com/joeyjiron06/istanbul-gh-pr-uncovered/workflows/Node.js%20Test%20CI/badge.svg?branch=master)

Uses the istanbul coverageMap and get's the uncovered lines from the current pull request related to the last commit that this process it running on.

## Installation

```bash
npm install istanbul-gh-pr-uncovered --save
```

## Usage

```js
const fetchUncoveredPrFiles =  require('istanbul-gh-pr-uncovered');

const uncoveredFiles = await fetchUncoveredPrFiles({
  coverageMap: jestTestResults.coverageMap,

  // appId of the installed app, in order to fetch github PR info
  appId,

  // the private key generated for the installed app
  privateKey
});

console.log(uncoveredFiles);
```
