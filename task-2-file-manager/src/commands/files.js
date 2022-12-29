const createReadStream = require('fs');
const createWriteStream = require('fs');
const fs = require('fs/promises');
const pipeline = require('stream/promises');
const helper = require('../helpers');
const MESSAGES = require('../messages');

const copyFile = async (pathToOldFile, pathToNewFile) => {
  await helper.checkThatExist(pathToOldFile);
  await helper.checkThatNotExist(pathToNewFile);
  const readable = createReadStream(pathToOldFile);
  const writable = createWriteStream(pathToNewFile);
  await pipeline(readable, writable);
};

const removeFile = async (pathToFile) => {
  await fs.rm(pathToFile);
};

const cat = async (pathToFile) => {
  await helper.checkThatExist(pathToFile);
  const readable = createReadStream(pathToFile, 'utf-8');
  readable.pipe(process.stdout);
  const end = new Promise((resolve, reject) => {
    readable.on('end', () => resolve());
    readable.on('error', () => reject());
  });
  await end;
};

const add = async (newFileName) => {
  await fs.writeFile(newFileName, '', { flag: 'wx' });
  console.log(MESSAGES.operationSuccessful);
};

const rn = async (pathToFile, newPathToFile) => {
  await helper.checkThatNotExist(newPathToFile);
  await fs.rename(pathToFile, newPathToFile);
  console.log(MESSAGES.operationSuccessful);
};

const cp = async (pathToOldFile, pathToNewFile) => {
  await copyFile(pathToOldFile, pathToNewFile);
  console.log(MESSAGES.operationSuccessful);
};

const rm = async (pathToFile) => {
  await removeFile(pathToFile);
  console.log(MESSAGES.operationSuccessful);
};

const mv = async (pathToOldFile, pathToNewFile) => {
  await copyFile(pathToOldFile, pathToNewFile);
  await removeFile(pathToOldFile);
  console.log(MESSAGES.operationSuccessful);
};

module.exports = {
  cat, add, rn, cp, rm, mv
};
