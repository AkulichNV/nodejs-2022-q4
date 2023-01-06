const fs = require('fs');
const url = require('url');
// const querystring = require('querystring');
const path = require("path");

// const file = fs.readFileSync(path.resolve(__dirname, "../data/compSciCourses.json"));
const data = fs.readFileSync(path.resolve(__dirname,'./data.json'));
let users = JSON.parse(data);

const requestHandler = (req, res) => {
    // const url = req.url;
    const method = req.method;
    const urlparse = url.parse(req.url, true);
    const userId = urlparse.pathname.split('/')[3];
  
  if(urlparse.pathname === '/api/users' && method === 'GET') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(users, null, 2));
  }
  if(urlparse.pathname === `/api/users/${userId}` && method === 'GET') {
    const isId = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId);
    if(isId) {
        const result = users.find((item) => item.id === userId);
        if(result){
            res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify(result, null, 2));
        } else {
            const message = { message: 'your id doesn\'t exist' };

            res.writeHead(404, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify(message, null, 2));
        }
    } 
      const message = { message: 'your id is invalid (not uuid)' };

      res.writeHead(400, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(message, null, 2));
  }
  if(urlparse.pathname == '/users' && method == 'POST')
  {
    //TODO: POST logic
  }
  if(url.pathname == '/users/tasks' && method == 'POST')
  {
    //TODO: POST logic
  }
  if(url.pathname == '/users' && method == 'PUT')
  {
    //TODO: PUT logic
  }
  if(url.pathname == '/users' && method == 'DELETE')
  {
    //TODO: DELETE logic
  } else {
    res.writeHead(404);
    res.end();
  }

//   res.setHeader('Content-Type', 'text/html');
//   res.write('<html>');
//   res.write('<head><title>My First Page</title><head>');
//   res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
//   res.write('</html>');
//   res.end();

};

exports.handler = requestHandler;