// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');

module.exports = async () => {
  dotenv.config({
    path: `${__dirname}/.env.test`,
  });


  // console.log('prcess.env', process.env);
};
