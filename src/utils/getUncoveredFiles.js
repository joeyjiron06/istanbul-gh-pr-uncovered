const { createFileCoverage } = require('istanbul-lib-coverage');

module.exports = (coverageMap) => {
  const uncoveredFiles = [];

  Object.keys(coverageMap.data).forEach((filename) => {
    const lines = createFileCoverage(coverageMap.data[filename].data).getUncoveredLines();

    if (lines.length === 1000) {
      console.log('im a loner');
    }

    if (lines.length > 0) {
      uncoveredFiles.push({
        filename,
        lines: lines.map((line) => Number(line)),
      });
    }
  });

  return uncoveredFiles;
};
