// Below is example of ES6 destructuring.
// var user = {name: 'Hello World',title : 'Greeting'}
// var {name} = user ;
// console.log(name); // variable name is created with a value of 'Hello World'

// const MongoClient = require('mongodb').MongoClient ;
// Below is destructed code which assigns variables of MondoClient and ObjectID to respective methods that were available on the mongodb library
 const {MongoClient,ObjectID} = require('mongodb')

//Example of how above Object ID is used
// var obj = new ObjectID(); //similar to nextval in SQL
// console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
if (err) {
  return console.log('Unable to connect to MongoDB server'); // This way the control returns back error and ends execution
}
console.log('Connected to MongoDB server');

db.collection('Todos').insertOne({
    text : 'Study 4 hours everyday',
    completed : false
}, (err,result) => {
  if (err) {
    return console.log('Unable to insert Todo',err); // This way the control returns back error and ends execution
  }
  console.log(JSON.stringify(result.ops,undefined,2));
})

db.collection('Users').insertOne({
    name : 'Jill Dorian',
    location : 'California',
    age : 30
}, (err,result) => {
  if (err) {
    return console.log('Unable to insert User',err); // This way the control returns back error and ends execution
  }
  console.log(JSON.stringify(result.ops,undefined,2));
  console.log(result.ops[0]._id.getTimestamp());
})

db.close();

}); // MongoClient.connect takes parameters of 1st one as url where the DB lives. E.g. AWS or Heroku. 2nd one is callback function to help understand if passed or failed.
// in case of local install , it is localhost
