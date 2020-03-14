// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

module.exports = async () => {
  dotenv.config({
    path: `${__dirname}/.env.test`,
  });


  console.log('prcess.env.GH_API', process.env.GH_API);
  console.log('prcess.env.GITHUB_URL', process.env.GITHUB_URL);
};
