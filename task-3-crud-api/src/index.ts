require('dotenv').config();
const http = require('http');
const app = require('./app.ts');

const PORT = process.env.PORT;

const server = http.createServer(app.handler);

server.listen(PORT, () => {
  console.log(`Server running on port: `, PORT);
});