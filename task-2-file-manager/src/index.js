const os = require('os');
const App = require('./app');
const wrapper = require('./wrapper');

wrapper.greeting();
process.on('exit', () => wrapper.goodbye());
const app = new App(os.homedir());
app.start();
