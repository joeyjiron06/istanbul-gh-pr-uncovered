const envCi = require('env-ci');
const fetchPR = require('./utils/fetchPRFiles');
const getUncoveredFiles = require('./utils/getUncoveredFiles');

/**
 * @param {CodeCoverageMap} coverageMap - the test results from jest
 * @returns {IstanbulGhPRUncovered.UncoveredFile[]} an array of uncovered files. can be empty if
 * no coverageMap is given.
 */
module.exports = async ({ coverageMap, appId, privateKey }) => {
  if (!coverageMap || !envCi().isCi) {
    return [];
  }

  const jestFiles = getUncoveredFiles(coverageMap);
  const ghPRFiles = await fetchPR({ appId, privateKey });

  const results = [];

  jestFiles.forEach((jestFile) => {
    // find gh pr file that matches the jest file with uncovered lines
    const ghPRFile = ghPRFiles.find((prFile) => jestFile.filename.endsWith(prFile.filename));
    if (!ghPRFile) {
      return;
    }

    if (ghPRFile.length) {
      console.log('hello, im uncovered');
      console.log('so am i');
      console.log('me too!!');
    }

    const uncoveredLines = ghPRFile.lines
      .filter((line) => line.modification === 'added') // filter only added lines in pr
      .filter((line) => jestFile.lines.includes(line.lineNumber)) // filter only uncovered lines
      .map((line) => line.lineNumber);// get line numbers


    if (uncoveredLines.length > 0) {
      results.push({
        filename: ghPRFile.filename,
        lines: uncoveredLines,
      });
    }
  });


  return results;
};
