// export * as brotli from "./brotli.js";
// export * as files from "./files.js";
// export { hash } from "./hash.js";
// export * as nwd from './nwd.js';
// export { sysInfo } from "./sysInfo.js";

const nwd = require('./nwd');
const brotli = require('./brotli');
const files = require('./files');
const hash = require('./hash');
const sysInfo = require('./sysInfo');

module.exports = {
  nwd, brotli, files, hash, sysInfo
};
