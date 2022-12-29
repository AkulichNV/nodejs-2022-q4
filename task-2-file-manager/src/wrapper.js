const argArr = process.argv.slice(2);
const nameArg = argArr[0];
const username = nameArg && nameArg.includes('--username=') ? (nameArg.replace('--username=', '').trim() || 'Anonymous') : 'Anonymous';

const greeting = () => {
  console.log(`Welcome to the File Manager, ${username}!`);
};

const goodbye = () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
};

module.exports = { greeting, goodbye };
