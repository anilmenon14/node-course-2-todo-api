const {MongoClient,ObjectID} = require('mongodb')



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
if (err) {
 return console.log('Unable to connect to MongoDB server'); // This way the control returns back error and ends execution
}
console.log('Connected to MongoDB server');

// Below are three methods available to delete . Name suggests what they do
//deleteOne
//deleteMany
//findOneAndDelete // This is the preferred one as it can return back the details of the document being deleted

db.collection('Todos').findOneAndDelete({
    text : "Procrastinate like a piece of shit",
    completed: true
}).then((result) =>{
    console.log(result);

},(err) => {
  console.log('Unable to delete any record');
})



db.close();

});
