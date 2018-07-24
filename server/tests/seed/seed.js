const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
first_name : "John",
last_name : "Petrucci",
_id : userOneID,
email_address :"Jp@dt.com",
password : "dtforlife",
tokens : [{
  access : 'auth',
  token : jwt.sign({_id : userOneID ,access : 'auth'},process.env.JWT_SECRET).toString()
}]
},{
  first_name : "John",
  last_name : "Myung",
  _id : userTwoID,
  email_address :"Jm@dt.com",
  password : "dtforever",
  tokens : [{
    access : 'auth',
    token : jwt.sign({_id : userTwoID ,access : 'auth'}, process.env.JWT_SECRET).toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text : 'First test todo',
  _creator : userOneID,
},{
  _id: new ObjectID(),
  text : 'Second test todo',
  completed: true,
  completedAt : 1224838373,
  _creator : userTwoID
}]


const populateTodos = (done) => {
  Todo.remove({}).then(() => { // wiping DB clean
  return Todo.insertMany(todos)  // adding 2 records from todos mentioned
}).then(() => done());
}


const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne =  new User(users[0]).save(); // This is a promise . Promise 1 of 2
    var userTwo = new User(users[1]).save(); // This is a promise as well. Promise 2 of 2

    return Promise.all([userOne,userTwo]) ; // This ensures return is completed when all promises are complete

  }).then(() => done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
}
