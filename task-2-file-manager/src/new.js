// const path = require('path');
const fs = require('fs');
// const fsProm = require('fs/promises');
// const readline = require('readline');
console.log("start")
const filePath = "C:\\Users\\Natahus\\hello.txt";
const readable = fs.createReadStream(filePath, 'utf-8');
await readable.pipe(process.stdout);
// console.log(readable.pipe);
console.log("End");

