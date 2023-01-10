const fs = require('fs');
const url = require('url');
// const querystring = require('querystring');
const path = require("path");
const { v4: uuidv4 } = require('uuid');

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
  else if(urlparse.pathname === `/api/users/${userId}` && method === 'GET') {
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
  else if(urlparse.pathname === '/api/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {    
      body += chunk.toString();
    });
    req.on('end', () => {
        const id = uuidv4();

        const jsonData = JSON.parse(body);
        const username = jsonData.username;
        const age = jsonData.age;
        const hobbies = jsonData.hobbies;

        const usernameExist = Object.keys(users).find(key => users[key].username === username);

        if (username && age && hobbies) {
          if(usernameExist) {
            const message = { message: 'this username already exist!' };
            res.writeHead(400, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify(message, null, 2));
          } 

          users[id] = { username, age, hobbies };
          fs.writeFile('src/data.json', JSON.stringify(users), (err) => {            
            if (err) {
              const message = { message: 'could not persist data!' };
              res.writeHead(400, {'Content-Type': 'application/json'});
              return res.end(JSON.stringify(message, null, 2));
            } 
            res.writeHead(201, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify(users, null, 2));
          });
        } else {
          const message = { message: 'request body does not contain required fields' };
      
          res.writeHead(400, {'Content-Type': 'application/json'});
          return res.end(JSON.stringify(message, null, 2));
        }
      });
  }
  else if(url.pathname === '/api/users' && method === 'PUT')
  {
    //TODO: PUT logic
  }
  else if(url.pathname === '/api/users' && method === 'DELETE')
  {
    //TODO: DELETE logic
  } else {
    res.writeHead(404);
    console.log('404');
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