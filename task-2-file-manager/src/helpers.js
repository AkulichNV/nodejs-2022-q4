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

const isExist = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

const checkThatExist = async (path) => {
  try {
    return await fs.stat(path);
  } catch (err) {
    throw new Error();
  }
};

const checkThatNotExist = async (path) => {
  const isFileExist = await isExist(path);
  if (isFileExist) {
    throw new Error();
  }
};

const isPathToFile = (filename) => {
  const dirMarkerRegExp = /\/|\\/g;
  return !dirMarkerRegExp.test(filename);
};

const checkIsNotFile = async (path) => {
  const pathStat = await checkThatExist(path);
  const isFile = pathStat.isFile();
  if (isFile) {
    throw new Error();
  }
};

const getDirFromPath = (filePath) => {
  return path.parse(filePath).dir;
};

module.exports = {
  parseInput,
  checkThatExist,
  checkThatNotExist,
  isPathToFile,
  checkIsNotFile,
  getDirFromPath
};
