const path = require('path');
const fs = require('fs');
const fsProm = require('fs/promises');
const readline = require('readline');
const commands = require('./commands/index');
const helper = require('./helpers');
const MESSAGES = require('./messages');


class App {
  constructor(startDir) {
    this.currentPath = startDir;
  }

  resolvePath(p) {
    return path.resolve(this.currentPath, p);
  }

  // async up() {
  //   const pathToUpperDir = this.resolvePath('..');
  //   this.currentPath = await commands.nwd.cd(pathToUpperDir);
  // }

  up() {
    const pathParts = this.currentPath.split('\\');
    if (pathParts.length > 1) {
      pathParts.pop();
      this.currentPath = pathParts.join('\\');
      // console.log(this.currentPath);
      return this.currentPath;
    }
    return this.currentPath;
  }

  // async cd(args) {
  //   const pathToDir = this.resolvePath(args[0]);
  //   this.currentPath = await commands.nwd.cd(pathToDir);
  // }

  cd(args) {
    const pathToDir = this.resolvePath(args[0]);
    if (fs.existsSync(pathToDir)) {
      this.currentPath = pathToDir;
    } else {
      console.log('Directory not found.');
    }
  }

  // async ls() {
  //   await commands.nwd.ls(this.currentPath);
  // }

  ls() {
    const dirList = fs.readdirSync(this.currentPath, { withFileTypes: true });
    // eslint-disable-next-line max-len
    const sortedDirList = dirList.sort((a, b) => a.isFile() - b.isFile()).filter((item) => !item.isSymbolicLink());
    const result = sortedDirList.map((el) => ({ Name: el.name, Type: el.isFile() ? 'file' : 'directory' }));
    console.log('');
    console.table(result);
  }

  // async cat(args) {
  //   const pathToFile = this.resolvePath(args[0]);
  //   await commands.files.cat(pathToFile);
  // }

  cat(args) {
    const pathToFile = this.resolvePath(args[0]);
    this.asynCat(pathToFile)
      .then((data) => console.log(data))
      .catch((reason) => console.log(`Message:${reason.message}`));
    console.log(3);
  }

  // eslint-disable-next-line class-methods-use-this
  async asynCat(pathToFile) {
    // const pathToFile = this.resolvePath(args[0]);
    console.log(1);
    const readable = await fs.createReadStream(pathToFile, 'utf-8');
    const data = await readable.pipe(process.stdout);
    console.log(2);
    return data;
  }

  async add(args) {
    const newFileName = this.resolvePath(args[0]);
    await commands.files.add(newFileName);
  }

  async rn(args) {
    const pathToFile = this.resolvePath(args[0]);
    const dir = helper.getDirFromPath(pathToFile);
    const newPathToFile = path.resolve(dir, args[1]);
    await commands.files.rn(pathToFile, newPathToFile);
  }

  async cp(args) {
    const pathToOldFile = this.resolvePath(args[0]);
    const pathToNewFile = this.resolvePath(args[1]);
    await commands.files.cp(pathToOldFile, pathToNewFile);
  }

  async mv(args) {
    const pathToOldFile = this.resolvePath(args[0]);
    const pathToNewFile = this.resolvePath(args[1]);
    await commands.files.mv(pathToOldFile, pathToNewFile);
  }

  async rm(args) {
    const pathToFile = this.resolvePath(args[0]);
    await commands.files.rm(pathToFile);
  }

  // eslint-disable-next-line class-methods-use-this
  os(args) {
    helper.sysInfo(args[0]);
  }

  async hash(args) {
    const pathToFile = this.resolvePath(args[0]);
    await helper.hash(pathToFile);
  }

  async compress(args) {
    const pathToSrc = this.resolvePath(args[0]);
    const pathToDest = this.resolvePath(args[1]);
    await commands.brotli.compress(pathToSrc, pathToDest);
  }

  async decompress(args) {
    const pathToSrc = this.resolvePath(args[0]);
    const pathToDest = this.resolvePath(args[1]);
    await commands.brotli.decompress(pathToSrc, pathToDest);
  }

  // eslint-disable-next-line class-methods-use-this
  ['.exit']() {
    process.exit();
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  validate(com, args) {
    switch (com) {
      case 'up':
      case 'ls':
      case '.exit':
        return true;

      case 'cd':
      case 'rm':
      case 'os':
      case 'hash':
      case 'cat':
        if (args[0]) {
          return true;
        }
        break;

      case 'mv':
      case 'cp':
      case 'compress':
      case 'decompress':
        if (args[0] && args[1]) {
          return true;
        }
        break;

      case 'add':
        if (args[0] && helper.isPathToFile(args[0])) {
          return true;
        }
        break;

      case 'rn':
        if (args[0] && args[1] && helper.isPathToFile(args[1])) {
          return true;
        }
        break;

      default:
        return false;
    }
  }

  async start() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const recursiveAsyncReadLine = async () => {
      console.log(`You are currently in ${this.currentPath}!`);
      rl.question('>: ', (input) => {
        const operands = input.split(' ');
        const command = operands[0];
        const args = operands.slice(1);
        // console.log([command](args));
        if (this.validate(command, args)) {
          // console.log([command](args));
          try {
            this[command](args);
            console.log(MESSAGES.operationSuccessful);
          } catch (err) {
          // console.log(err);
            console.log(MESSAGES.operationFailed);
          }
        } else {
          console.log(MESSAGES.invalidInput);
        }
        recursiveAsyncReadLine();
      });

      // while (true) {
      //   // eslint-disable-next-line no-await-in-loop
      //   const input = await rl.question(`You are currently in ${this.currentPath}\n`);
      //   const [com, ...args] = helper.parseInput(input);
      //   if (this.validate(command, args)) {
      //     try {
      //       // eslint-disable-next-line no-await-in-loop
      //       await this[com](args);
      //     } catch (err) {
      //     // console.log(err);
      //       console.log(MESSAGES.operationFailed);
      //     }
      //   } else {
      //     console.log(MESSAGES.invalidInput);
      //   }
      // }
    };
    await recursiveAsyncReadLine();
  }
}

module.exports = App;
