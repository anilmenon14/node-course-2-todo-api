
//Workaround to set environment to development for local use since NODE_ENV seems to default to production unless it is invoked via test script
if (process.env.PORT === undefined && process.env.NODE_ENV != "test")
{
process.env.NODE_ENV = "development";
}

var env = process.env.NODE_ENV || 'development';

console.log('environment is',env);

if ( env === 'development' || env === 'test') {
var config = require('./config.json');
console.log(config);
var envConfig = config[env]; // set envConfig to value based on key value pairs or 'env' passed

//below is a forEach loop that goes through each key and assigns the right process.env with respective param
Object.keys(envConfig).forEach((key) => {
  process.env[key] = envConfig[key];
});
};



// Reason for above is to have different DBs be connected to when using App(i.e. Heroku or web server) vs Local (i.e. Postman locally) vs Mocha ( i.e. server.test.js testing)
// Refer package.json file , under "scripts" to see how it has been set up. Windows uses SET command , Linux and OSX uses EXPORT
// Heroku sets to production at start, hence doesn't need changing. for test scripts it is set to test as per command in package.json. IF not set to above 2, it becomes 'development' as default , as defined above.

//below code commented out since it is not efficient if there are multiple envs. config.json with method used above is better

// if (env==="development"){
// process.env.PORT = 3000;
// process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp' // Local development DB
//
// }else if (env=== "test"){
// process.env.PORT = 3000;
// process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest' // Sets DB to test DB
//
// }


// Heroku sets Port and MONGODB_URI on startup. Doesn't need definition
