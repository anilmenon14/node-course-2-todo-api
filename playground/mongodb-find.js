// const MongoClient = require('mongodb').MongoClient ;
// Below is destructed code which assigns variables of MondoClient and ObjectID to respective methods that were available on the mongodb library
 const {MongoClient,ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
if (err) {
  return console.log('Unable to connect to MongoDB server'); // This way the control returns back error and ends execution
}
console.log('Connected to MongoDB server');

db.collection('Todos').find({text : 'Go to gym'}).toArray().then((docs) => {
        console.log('Pulling back data for text criteria....');
        console.log(JSON.stringify(docs,undefined,2));

}, (err) => {
  console.log('Unable to fetch todos');
});

db.collection('Todos').find({completed : false}).toArray().then((docs) => {
        console.log('Pulling back data for completed criteria ....');
        console.log(JSON.stringify(docs,undefined,2));

}, (err) => {
  console.log('Unable to fetch todos');
});

db.collection('Todos').find({
  _id : new ObjectID('5b1d7392356a5a13f87287e0')})
  .toArray().then((docs) => {
        console.log('Pulling back data for ObjectID criteria ....');
        console.log(JSON.stringify(docs,undefined,2));

}, (err) => {
  console.log('Unable to fetch todos');
});


db.collection('Todos').find()
  .count((err,count) => {

    if (err) {
      return console.log('Unable to retrieve count',err);
    }
        console.log('Pulling back count ....');
        console.log(count);

});
db.close();

}); // MongoClient.connect takes parameters of 1st one as url where the DB lives. E.g. AWS or Heroku. 2nd one is callback function to help understand if passed or failed.
// in case of local install , it is localhost
