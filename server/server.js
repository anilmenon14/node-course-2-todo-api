//Library Imports
const express = require('express');
const bodyParser = require('body-parser') // Lib used to convert string to JSON without needing to do additional steps
const {ObjectID} = require('mongodb');
const _ = require('lodash') ; // using for update routes , i.e. for PATCH
const bcrypt = require('bcryptjs');// used for password hashing and compare


// Local Imports
require('./config/config') //dev,prod,test DB connection settings in config.js file
var {mongoose} = require('./db/mongoose')
var {authenticate} = require('./middleware/authenticate')
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
// Above is deconstructed usage from ES6 which uses mongoose method from the library and assigns to same named mongoose module in this file
// i.e. equivalent to mongoose = require('./db/mongoose').mongoose



var app = express();
const port = process.env.PORT;

app.use(bodyParser.json())

//  POST route to receive a request to upload to database

app.post( '/todos',authenticate, (req,res) => {
var todo = new Todo (
{
  text : req.body.text,
  _creator : req.user._id,
}
)

todo.save().then((doc)=> {
  console.log('Posted successfully');
  res.send(doc);
},(err) => {
  res.status(400).send(err);
  console.log("Failed to post");
});


});

// GET route to pull up ALL records from the database

app.get('/todos',authenticate,(req,res) => {
    Todo.find({ _creator : req.user._id}).then((todos)=> {
res.send({todos}); // by using this notation , you are asking for response as an object with response text as just one of the returns, you can add more into the object
console.log('Retrieved successfully');
    },(err) => {
      res.status(400).send(err);
    })

})

// GET record by ID

app.get('/todos/:id',authenticate,(req,res)=> {
  var id = req.params.id
  if (!ObjectID.isValid(id)){
    return res.status(404).send()
  }
  Todo.find({_id:id,_creator:req.user._id}).then((todo) => {
    if (!todo[0]) {  // find sends back and array as opposed to findbyId which sends back object. Hence it is needed to check for 1st item. Only 1 is expected as it is a search by ID
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e)
  });
});


//DELETE record by ID

app.delete('/todos/:id',authenticate,(req,res)=> {
// get the id

var id = req.params.id;

// if not valid, return 404

if (!ObjectID.isValid(id)){
  return res.status(404).send()
}


// remove todo by id
Todo.findOneAndRemove({_id:id,_creator:req.user._id}).then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      return res.status(200).send({todo})

}).catch((e)=> res.status(400).send())
});


//Update using PATCH HTTP calls


app.patch('/todos/:id',authenticate, (req,res) => {

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
     {_id:id,_creator:req.user._id}
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


//Get User with token authentication
// reusable function 'authenticate' created and used below as middleware. Placed in authenticate.js in middleware, which will check if token passed exists
app.get('/users/me', authenticate, (req,res) => {

res.send(req.user)

});

// POST /users/login (email,password)

app.post('/users/login', (request,response)=> {
User.findbyCreds(request.body.email_address,request.body.password).then((user) => {

  return user.generateAuthToken().then((token)=> {
    response.header('x-auth',token).send(user); // Calling function defined in UserSchema
  // res.status(200).send(users);
});

}).catch((e) => {response.status(403).send('Error. User does not exist')})


});

// DELETE token /users/me/token, i.e. when logging out
// use 'authenticate' since user needs to be logged in to be logged out


app.delete('/users/me/token', authenticate, (req, res) => {
  var user = new User(req.user);
  // console.log(user1 instanceof User ); // will return true indicating it is instance of User model
  // console.log(req.user instanceof User); // This one returns false indicating instance methods will throw errors
  user.removeToken(req.token).then(() => {
    res.status(200).send('Logged out successfully');
  }, () => {
    res.status(400).send();
  });
});


// App listen setup

app.listen(port,() => {
  console.log('Started on port ',port);
})


module.exports = {app};
