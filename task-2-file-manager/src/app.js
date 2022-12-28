const path = require('path');
const createInterface = require('readline');
const command = require('./commands/index');
const helper = require('./helpers');
const MESSAGES = require('./messages');

export default class App {
  constructor(startDir) {
    this.currentPath = startDir;
  }

  resolvePath(p) {
    return path.resolve(this.currentPath, p);
  }

  async up() {
    const pathToUpperDir = this.resolvePath('..');
    this.currentPath = await command.nwd.cd(pathToUpperDir);
  }

  async cd(args) {
    const pathToDir = this.resolvePath(args[0]);
    this.currentPath = await command.nwd.cd(pathToDir);
  }

  async ls() {
    await command.nwd.ls(this.currentPath);
  }

  async cat(args) {
    const pathToFile = this.resolvePath(args[0]);
    await command.files.cat(pathToFile);
  }

  async add(args) {
    const newFileName = this.resolvePath(args[0]);
    await command.files.add(newFileName);
  }

  async rn(args) {
    const pathToFile = this.resolvePath(args[0]);
    const dir = helper.getDirFromPath(pathToFile);
    const newPathToFile = path.resolve(dir, args[1]);
    await command.files.rn(pathToFile, newPathToFile);
  }

  async cp(args) {
    const pathToOldFile = this.resolvePath(args[0]);
    const pathToNewFile = this.resolvePath(args[1]);
    await command.files.cp(pathToOldFile, pathToNewFile);
  }

  async mv(args) {
    const pathToOldFile = this.resolvePath(args[0]);
    const pathToNewFile = this.resolvePath(args[1]);
    await command.files.mv(pathToOldFile, pathToNewFile);
  }

  async rm(args) {
    const pathToFile = this.resolvePath(args[0]);
    await command.files.rm(pathToFile);
  }

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
    await command.brotli.compress(pathToSrc, pathToDest);
  }

  async decompress(args) {
    const pathToSrc = this.resolvePath(args[0]);
    const pathToDest = this.resolvePath(args[1]);
    await command.brotli.decompress(pathToSrc, pathToDest);
  }

  ['.exit']() {
    process.exit();
  }

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
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    while (true) {
      const input = await rl.question(`You are currently in ${this._currentPath}\n`);
      const [command, ...args] = parseInput(input);
      if (this.validate(command, args)) {
        try {
          await this[command](args);
        } catch (err) {
        // console.log(err);
          console.log(MESSAGES.operationFailed);
        }
      } else {
        console.log(MESSAGES.invalidInput);
      }
    }
  }
}
