const fs = require('fs/promises');
const helper = require('../helpers');

const cd = async (pathToDir) => {
  await helper.checkIsNotFile(pathToDir);
  return pathToDir;
};

const ls = async (currentPath) => {
  const dirList = await fs.readdir(currentPath, { withFileTypes: true });
  // eslint-disable-next-line max-len
  const sortedDirList = dirList.sort((a, b) => a.isFile() - b.isFile()).filter((item) => !item.isSymbolicLink());
  const result = [];
  sortedDirList.forEach((el) => {
    result.push({ Name: el.name, Type: el.isFile() ? 'file' : 'directory' });
  });
  console.log('');
  console.table(result);
};

module.exports = { cd, ls };
