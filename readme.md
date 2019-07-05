# Task Manager

A simple RESTful API using TypeScript and MongoDB with Mongoose.

## Guild

At first, you should install

1. **TypeScript**
2. **Mongodb** and GUI **Robo3T**
3. **Postman** for testing the endpoint.

Second, in the folder, run
`tsc -b`
to transpile TypeScript to Javascript into the dist folder.

Third, you should run mongodb server, in my case, I run
`~/mongodb/bin/mongod --dbpath ~/mongodb-data`

Finally, run
`yarn install` to install the dependencies, and
`yarn run build` to execute index.js file for hosting api server.

If you host server successfully, then you can start testing endpoint below.

## API endpoint

### User model

- GET - /users #return all users' documents.
- POST - /users #inserts a new user into the database, sending JSON like `{ "name": "John Doe", "email": "john@gmail.com" }`
- PATCH - /users/:id #updates a user with id, sending JSON like `{ "name": "John Doe", "email": "johndoe@gmail.com" }`
- DELETE - /users/:id #deletes a user with id.

### Task model

- POST - /task #inserts a new task into the database, sending JSON like `{ "owner": "5d187f1bcf75d43c4ee2086a", "description": "wash the dishes." }`
- GET - /task/:id #return the task and owner's information with the task's id.

## References

1. [The Complete Node.js Developer Course (3rd Edition) by Andrew Mead, Rob Percival](https://www.udemy.com/the-complete-nodejs-developer-course-2/)
2. [Strongly typed models with Mongoose and TypeScript by Tom Nagle](https://medium.com/@tomanagle/strongly-typed-models-with-mongoose-and-typescript-7bc2f7197722)
3. [Typescript REST API And MongoDB Beginners by Elliot Forbes](https://tutorialedge.net/typescript/typescript-mongodb-beginners-tutorial/)
