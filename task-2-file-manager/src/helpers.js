const fs = require('fs');
const path = require('path');

const parseInput = (input) => {
  let args = input.split(' ');
  const quoteRegExp = /"|'/g;
  if (quoteRegExp.test(args)) {
    const quotesRegExp = /["'] | ["']/;
    args = args
      .join(' ')
      .split(quotesRegExp)
      .map((arg) => arg.replace(quoteRegExp, ''));
  }
  return args;
};

const isExist = async (dir) => {
  try {
    await fs.access(dir);
    return true;
  } catch (error) {
    return false;
  }
};

const checkThatExist = async (dir) => {
  try {
    return await fs.stat(dir);
  } catch (err) {
    throw new Error();
  }
};

const checkThatNotExist = async (dir) => {
  const isFileExist = await isExist(dir);
  if (isFileExist) {
    throw new Error();
  }
};

const isPathToFile = (filename) => {
  const dirMarkerRegExp = /\/|\\/g;
  return !dirMarkerRegExp.test(filename);
};

const checkIsNotFile = async (dir) => {
  const pathStat = await checkThatExist(dir);
  const isFile = pathStat.isFile();
  if (isFile) {
    throw new Error();
  }
};

const getDirFromPath = (filePath) => path.parse(filePath).dir;

module.exports = {
  parseInput,
  checkThatExist,
  checkThatNotExist,
  isPathToFile,
  checkIsNotFile,
  getDirFromPath
};
