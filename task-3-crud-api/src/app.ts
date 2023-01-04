const fs = require('fs');
const url = require('url');
// const querystring = require('querystring');

const data = fs.readFileSync('./data.json');
let users = JSON.parse(data);

const requestHandler = (req, res) => {
    // const url = req.url;
    const method = req.method;
    const urlparse = url.parse(req.url, true);
  
  if(urlparse.pathname == '/users' && method == 'GET')
  {
    //TODO: GET logic
  }
  if(urlparse.pathname == '/users' && method == 'POST')
  {
    //TODO: POST logic
  }
  if(urlparse.pathname == '/users/tasks' && method == 'POST')
  {
    //TODO: POST logic
  }
  if(urlparse.pathname == '/users' && method == 'PUT')
  {
    //TODO: PUT logic
  }
  if(urlparse.pathname == '/users' && method == 'DELETE')
  {
    //TODO: DELETE logic
  }

};

exports.handler = requestHandler;