// const createReadStream = require('fs');
// const createWriteStream = require('fs');
const fs = require('fs');
const fsProm = require('fs/promises');
const pipeline = require('stream/promises');
const helper = require('../helpers');
const MESSAGES = require('../messages');

const copyFile = async (pathToOldFile, pathToNewFile) => {
  await helper.checkThatExist(pathToOldFile);
  await helper.checkThatNotExist(pathToNewFile);
  const readable = fs.createReadStream(pathToOldFile);
  const writable = fs.createWriteStream(pathToNewFile);
  await pipeline(readable, writable);
};

const removeFile = async (pathToFile) => {
  await fsProm.rm(pathToFile);
};

const cat = async (pathToFile) => {
  await helper.checkThatExist(pathToFile);
  const readable = fs.createReadStream(pathToFile, 'utf-8');
  readable.pipe(process.stdout);
  const end = new Promise((resolve, reject) => {
    readable.on('end', () => resolve(console.log('')));
    readable.on('error', () => reject());
  });
  await end;
};

const add = async (newFileName) => {
  await fsProm.writeFile(newFileName, '', { flag: 'wx' });
  console.log(MESSAGES.operationSuccessful);
};

const rn = async (pathToFile, newPathToFile) => {
  await helper.checkThatNotExist(newPathToFile);
  await fsProm.rename(pathToFile, newPathToFile);
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
