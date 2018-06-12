const {MongoClient,ObjectID} = require('mongodb')



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
if (err) {
 return console.log('Unable to connect to MongoDB server'); // This way the control returns back error and ends execution
}
console.log('Connected to MongoDB server');

//findOneAndUpdate . Takes in (filter, update, options, callback)

// db.collection('Todos').findOneAndUpdate({
//     text : "Go to gym",
//     completed: true
// },
// {$set :
// {completed: false, progress : "60%" }   // $set is a mongoDB update operator. refer to documentation
// },
// {
//   returnOriginal: false  // Option required to ensure updated one is returned
// }
// ).then((result) =>{
//     console.log(result);
//
// },(err) => {
//   console.log('Unable to update any record');
// })

db.collection('Users').findOneAndUpdate({
  _id : new ObjectID("5b1d75fd9b9f7b2bb86fecaf")
},
{$set :
{name: "Jillian Dorian"  } // $set is a mongoDB update operator. refer to documentation
, $inc : {age: 1}   //$inc is used to increment
},
{
  returnOriginal: false  // Option required to ensure updated one is returned
}
).then((result) =>{
    console.log(result);

},(err) => {
  console.log('Unable to update any record');
})



db.close();

});
