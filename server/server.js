//Library Imports
var express = require('express');
var bodyParser = require('body-parser') // Lib used to convert string to JSON without needing to do additional steps
const {ObjectID} = require('mongodb');


// Local Imports
var {mongoose} = require('./db/mongoose')
// Above is deconstructed usage from ES6 which uses mongoose method from the library and assigns to same named mongoose module in this file
// i.e. equivalent to mongoose = require('./db/mongoose').mongoose
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())

//  POST route to receive a request to upload to database

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

// GET route to pull up ALL records from the database

app.get('/todos',(req,res) => {
    Todo.find().then((todos)=> {
res.send({todos}); // by using this notation , you are asking for response as an object with response text as just one of the returns, you can add more into the object
console.log('Retrieved successfully');
    },(err) => {
      res.status(400).send(err);
    })

})

// GET record by ID

app.get('/todos/:id',(req,res)=> {
  var id = req.params.id
  if (!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e)
  });
});


//DELETE record by ID

app.delete('/todos/:id',(req,res)=> {
// get the id

var id = req.params.id;

// if not valid, return 404

if (!ObjectID.isValid(id)){
  return res.status(404).send()
}


// remove todo by id
Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      return res.status(200).send({todo})

}).catch((e)=> res.status(400).send())

      //if  no doc, send 404
      //if doc, send doc back with 404




})

// App listen setup

app.listen(port,() => {
  console.log('Started on port ',port);
})


module.exports = {app};
