//Library Imports
var express = require('express');
var bodyParser = require('body-parser') // Lib used to convert string to JSON without needing to do additional steps


// Local Imports
var {mongoose} = require('./db/mongoose')
// Above is deconstructed usage from ES6 which uses mongoose method from the library and assigns to same named mongoose module in this file
// i.e. equivalent to mongoose = require('./db/mongoose').mongoose
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

app.use(bodyParser.json())

app.post( '/todos', (req,res) => {
var todo = new Todo (
{
  text : req.body.text
}
)

todo.save().then((doc)=> {
  console.log('Posted successfully');
  res.send(doc);
},(err) => {
  res.status(400).send(err);
  console.log("Failed to post");1
});


})

app.get('/todos',(req,res) => {
    Todo.find().then((todos)=> {
res.send({todos}); // by using this notation , you are asking for response as an object with response text as just one of the returns, you can add more into the object

    },(e) => {
      res.status(400).send(err);
    })

})

app.listen(3000,() => {
  console.log('Started on port 3000');
})


module.exports = {app};
