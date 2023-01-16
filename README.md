# RSSchool task-3 CRUD API

Implement simple CRUD API using in-memory database underneath.

## Downloading

```bash
https://github.com/AkulichNV/nodejs-2022-q4.git
```

```bash
cd task-3-crud-api
```

### Install NPM modules

```bash
npm install
```

### Run application

1. Running the application in the **development mode** (write into the console):

```bash
npm run start:dev
```

If everything OK, on console appear `Server running at port 8000`
If your port 8000 is already in use, so change port in file `.env` `PORT=<your free port>`

2. Running the application in the **production mode** (write into the console):

```bash
npm run start:prod
```

If everything OK, on console appear `webpack 5.75.0 compiled successfully in ... ms` and appear folder `dist` with file `bundle.js`

### Request methods

   * **GET** `/api/users`:
   
     * **200** - object of users

   * **GET** `/api/users/:id`:
   
     * **200** - user with specified id
     
     * **400** - id is not valid uuid
     
     * **404** - user is not found

   * **POST** `/api/users`:
   
     * **201** - created a new user
     
     * **400** - body request is not valid

   Structure of the object to create a new user:

  ```JSON
    {
      "username": "Adrian",
      "age": 2,
      "hobbies": ["climbing", "laughing"]
    }
  ```

   * **PUT** `/api/users/:id`:
   
     * **200** - updated user object
     
     * **400** - id is not valid or request body
     
     * **404** - user is not found

   * **DELETE** `/api/users/:id`:
   
     * **204** - user deleted succesfully
     
     * **400** - id is not valid or request body
     
     * **404** - user is not found