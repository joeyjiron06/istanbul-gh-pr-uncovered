const { createFileCoverage } = require('istanbul-lib-coverage');

module.exports = (coverageMap) => {
  const uncoveredFiles = [];

  Object.keys(coverageMap).forEach((filename) => {
    const coverageData = coverageMap[filename];
    const fileCoverage = createFileCoverage(coverageData);
    const lines = fileCoverage.getUncoveredLines();

    if (lines.length > 0) {
      uncoveredFiles.push({
        filename,
        lines: lines.map((line) => Number(line)),
      });
    }
  });

  return uncoveredFiles;
};
