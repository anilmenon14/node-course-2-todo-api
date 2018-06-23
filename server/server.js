//Library Imports
const express = require('express');
const bodyParser = require('body-parser') // Lib used to convert string to JSON without needing to do additional steps
const {ObjectID} = require('mongodb');
const _ = require('lodash') ; // using for update routes , i.e. for PATCH


// Local Imports
require('./config/config') //dev,prod,test DB connection settings in config.js file
var {mongoose} = require('./db/mongoose')
// Above is deconstructed usage from ES6 which uses mongoose method from the library and assigns to same named mongoose module in this file
// i.e. equivalent to mongoose = require('./db/mongoose').mongoose
var {Todo} = require('./models/todo');
var {User} = require('./models/user');



var app = express();
const port = process.env.PORT;

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
});


//Update using PATCH HTTP calls


app.patch('/todos/:id', (req,res) => {

var id = req.params.id;
var body = _.pick(req.body,['text','completed']);  // This lodash function helps define which fields can be updated by user using HTTP calls . Limited to text and completed status. Does not allow 'completedAt' to be changed.

if (!ObjectID.isValid(id)){
  return res.status(404).send()
}

if (_.isBoolean(body.completed) && body.completed) {
  body.completedAt = new Date().getTime();
} else {
  body.completed = false;
  body.completedAt  = null;
};

// Can also use findByIdAndUpdate which takes id directly as first param
Todo.findOneAndUpdate(
     {_id : id}
    ,{$set :body}
    ,{new: true} // Option required to ensure updated one is returned
).then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      return res.status(200).send({todo})

}).catch((e) => console.log(e));


});


//Add User with email address

app.post('/users',(req,res) => {


var body = _.pick(req.body,['first_name','last_name','email_address','password']); // pick out the mentioned fields for processing only

var user = new User(body);

user.save().then((users)=>{
  return users.generateAuthToken(); // Calling function defined in UserSchema
  // res.status(200).send(users);
}).then((token)=> {
  res.header('x-auth',token).send(user) // This 'user' variable is coming from the one defined above
}).catch((e)=> {
  res.status(400).send(e);
  console.log('Unable to post the message');
});

});



// App listen setup

app.listen(port,() => {
  console.log('Started on port ',port);
})


module.exports = {app};
