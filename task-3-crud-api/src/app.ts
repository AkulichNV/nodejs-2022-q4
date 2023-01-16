const fs = require('fs');
const url = require('url');
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const data = fs.readFileSync(path.resolve(__dirname,'./data.json'));
let users = JSON.parse(data);

const requestHandler = (async (req: any, res: any) => {
    const method = req.method;
    const urlparse = url.parse(req.url, true);
    const userId = urlparse.pathname.split('/')[3];
  
  if(urlparse.pathname === '/api/users' && method === 'GET') {
    try {
      res.writeHead(200, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(users, null, 2));
    } catch (err: any) { 
      console.log(`Error in Catch commentOnGet:  ${err}`);
      const message = { error: 'Something went wrong' };
      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(message, null, 2));
    }
  }
  else if(urlparse.pathname === `/api/users/${userId}` && method === 'GET') {
    try {
        const isId = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId);
      if(isId) {
        const existId = Object.keys(users).find((item) => item === userId);
        if(existId){
          res.writeHead(200, {'Content-Type': 'application/json'});
          return res.end(JSON.stringify(users[existId], null, 2));
        } else {
          const message = { message: 'there is no user with specified id' };

          res.writeHead(404, {'Content-Type': 'application/json'});
          return res.end(JSON.stringify(message, null, 2));
        }
      } 
      const message = { message: 'your id is invalid (not uuid)' };
      res.writeHead(400, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(message, null, 2));
    } catch (err: any) { 
      console.log(`Error in Catch commentOnGet: ${err}`);
      const message = { error: 'Something went wrong' };
      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(message, null, 2));
    }
  }
  else if(urlparse.pathname === '/api/users' && method === 'POST') {
    try {
      let body = '';
      req.on('data', (chunk: Buffer) => {   
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
          fs.writeFile('src/data.json', JSON.stringify(users, null, 2), (err: Error) => {            
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
    } catch (err: any) { 
      console.log(`Error in Catch commentOnPost: ${err}`);

      const message = { error: 'Something went wrong' };

      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(message, null, 2));
     }
  }
  else if(urlparse.pathname === `/api/users/${userId}` && method === 'PUT') {
    try {
      const isId = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId);
      if(isId) {
        const existId = Object.keys(users).find((item) => item === userId);
        if(existId){
          let body = '';
  
          req.on('data', (chunk: Buffer) => {    
            body += chunk.toString();
          });
  
          req.on('end', () => {
            const id = uuidv4();
          
            const jsonData = JSON.parse(body);
            const username = jsonData.username;
            const age = jsonData.age;
            const hobbies = jsonData.hobbies;

            users[userId] = { username, age, hobbies };

            fs.writeFile('src/data.json', JSON.stringify(users, null, 2), (err: Error) => {            
              if (err) {
                const message = { message: 'could not persist data!' };
                res.writeHead(400, {'Content-Type': 'application/json'});
                return res.end(JSON.stringify(message, null, 2));
              } 
            res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify(users, null, 2));
            })
          })
        } else {
          const message = { message: 'your id doesn\'t exist' };
          res.writeHead(404, {'Content-Type': 'application/json'});
          return res.end(JSON.stringify(message, null, 2));
        }
      } else {
        const message = { message: 'your id is invalid (not uuid)' };
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(message, null, 2));
      }
    } catch (err: any) { 
      console.log(`Error in Catch commentOnPut: ${err}`);
      const message = { error: 'Something went wrong' };
      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(message, null, 2));
    }
  }
  else if(urlparse.pathname === `/api/users/${userId}` && method === 'DELETE') {
    try {
      const isId = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId);
      if(isId) {
        const existId = Object.keys(users).find((item) => item === userId);
        if(existId){
          delete users[userId];
          fs.writeFile('src/data.json', JSON.stringify(users, null, 2), (err: Error) => {            
            if (err) {
              const message = { message: 'could not persist data!' };
              res.writeHead(400, {'Content-Type': 'application/json'});
              return res.end(JSON.stringify(message, null, 2));
            } 
            const message = { message: `user ${userId} deleted successfully!` };
            res.writeHead(204, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify(message, null, 2));
          })
        } else {
          const message = { message: 'your id doesn\'t exist' };
          res.writeHead(404, {'Content-Type': 'application/json'});
          return res.end(JSON.stringify(message, null, 2));
        }
      } else {
        const message = { message: 'your id is invalid (not uuid)' };
        res.writeHead(400, {'Content-Type': 'application/json'});
        return res.end(JSON.stringify(message, null, 2));
      }
    } catch (err: any) { 
      console.log(`Error in Catch commentOnDelete: ${err}`);
      const message = { error: 'Something went wrong' };
      res.writeHead(500, {'Content-Type': 'application/json'});
      return res.end(JSON.stringify(message, null, 2));
    }
  } else {
    const message = { message: 'this request does not exist' };
    res.writeHead(404, {'Content-Type': 'application/json'});
    return res.end(JSON.stringify(message, null, 2));
  }
});

exports.handler = requestHandler;