const createReadStream = require('fs');
const createWriteStream = require('fs');
const pipeline = require('stream/promises');
const createBrotliCompress = require('zlib');
const createBrotliDecompress = require('zlib');
const helper = require('../helpers');
const MESSAGES = require('../messages');

const implementBrotli = async (pathToSrc, pathToDest, action) => {
  await helper.checkThatExist(pathToSrc);
  await helper.checkThatNotExist(pathToDest);
  let brotli;
  if (action === 'decompress') {
    brotli = createBrotliDecompress();
  } else {
    brotli = createBrotliCompress();
  }
  const srcStream = createReadStream(pathToSrc);
  const destStream = createWriteStream(pathToDest);
  await pipeline(srcStream, brotli, destStream);
  console.log(MESSAGES.operationSuccessful);
};

const compress = async (...args) => {
  await implementBrotli(...args, 'compress');
};

const decompress = async (...args) => {
  await implementBrotli(...args, 'decompress');
};

module.exports = { compress, decompress };
