<img src="project-logo.png" width="200">

# Getting started

To get the Node server running locally:

* Clone this repo
* `npm install` to install all required dependencies
* Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
* `npm run dev` to start the local server
* `npm run nodemon` to start the local server with debug inspect port up
* `npm test` this will test all the endpoint.

Alternately, to quickly try out this repo in the cloud, you can [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/realworld)

# Code Overview

## Dependencies

* [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
* [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
* [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript
* [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The `mongoose-unique-validator` plugin helps us by formatting the error like a normal mongoose `ValidationError`.
* [passport](https://github.com/jaredhanson/passport) - For handling user authentication
* [slug](https://github.com/dodo/node-slug) - For encoding titles into a URL-friendly format

## Application Structure

* `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
* `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
* `routes/` - This folder contains the route definitions for our API.
* `models/` - This folder contains the schema definitions for our Mongoose models.

## Error Handling

In `routes/api/index.js`, we define a error-handling middleware for handling Mongoose's `ValidationError`. This middleware will respond with a 422 status code and format the response to have [error messages the clients can understand](https://github.com/gothinkster/realworld/blob/master/API.md#errors-and-status-codes)

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. We define two express middlewares in `routes/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will _not_ return a 401 status code if the request cannot be authenticated.

<br />

## dotenv configuration

* Create a .env file on the project root directory before start the backend service.

```
NODE_ENV=development
SESSION_SECRET=wearethecoinotcppl@chinahuatah!
MONGODB_URI=mongodb://localhost/coinotc
PORT=4001
GOOGLE_APPLICATION_CREDENTIALS=/home/kenneth/Projects/coinotc-svr/coinotc-mobile-dev-firebase-adminsdk-2pfht-29d893f4f0.json
MAILGUN_API_KEY=key-e5b16dae5fb71157586d345c3df82e46
MAILGUN_DOMAIN=mg.coinotc.market
FIREBASE_PROJECT_ID=coinotc-mobile-dev
FIREBASE_BUCKET=coinotc-mobile-dev.appspot.com
API_DOMAIN_URL=http://localhost:4001/api
COINOTC_FROM_EMAIL=coinotc👻 <postmaster@mg.coinotc.market>
COINOTC_WALLET_API_KEY=c1b8bf20420592a88300bc3e01405917fba41bcb64b6dc51497f64a3b8c3df59
COINOTC_GLOBAL_WALLET_PASSWORD=123456h67890Fsfrdssdcdredsafd432
COINOTC_WALLET_API_URL=http://localhost:3001/api/
COINOTC_WALLET_ORIGIN=http://localhost:4001
```

## Change Stream Configuration

-On starting up your MongoDB instance please

```
Run : mongod --dbpath ./data/db --replSet "rs"
Then in a separate shell tab, run: mongo
After the rs:PRIMARY > prompt appears, run: rs.initiate()
```
