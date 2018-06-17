var env = process.env.NODE_ENV || 'development';

// Reason for above is to have different DBs be connected to when using App(i.e. Heroku or web server) vs Local (i.e. Postman locally) vs Mocha ( i.e. server.test.js testing)
// Refer package.json file , under "scripts" to see how it has been set up. Windows uses SET command , Linux and OSX uses EXPORT
// Heroku sets to production at start, hence doesn't need changing. for test scripts it is set to test as per command in package.json. IF not set to above 2, it becomes 'development' as default , as defined above.

if (env==="development"){
process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp' // Local development DB

}else if (env=== "test"){
process.env.PORT = 3000;
process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest' // Sets DB to test DB

}


// Heroku sets Port and MONGODB_URI on startup. Doesn't need definition
