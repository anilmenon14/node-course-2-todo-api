const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id = "5b2387c668a2553006feb145" ;
var user_id = "5b225f30afa2114c3b427902111"

if (!ObjectID.isValid(user_id)){
console.log(`ID ${id} is not valid`);

}

// var task = "First test todo"

// Todo.find({
//     text : task ,// mongoose doesn't need us to write syntax of id as new ObjectID(id) . It does that automatically. This is in contrast with mongodb which mandates this syntax
//
// }).then((todos) => {
//   console.log('find Todo',todos);
// }, (err) => {
//   console.log('Cannot find this crap',err);
// })
//
//
// Todo.findOne({
//       text : task  ,// mongoose doesn't need us to write syntax of id as new ObjectID(id) . It does that automatically. This is in contrast with mongodb which mandates this syntax
//
// }).then((todos) => {
//   console.log('findOne todo',todos);
// }, (err) => {
//   console.log('Cannot find this crap',err);
// })

// Todo.findById(id).then((todos) => {
//   console.log('findById todo',todos);
// }, (err) => {
//   console.log('Cannot find this crap',err);
// });

// Method 1 : error callback is 2nd argument in the then Promise function
User.findById(user_id).then((result) => {
  console.log('User is ',result);
},(err) => {
  console.log('This user does not exist');
})

//Method 2 : using only one param for the then function and using catch error on next function in chain
User.findById(user_id).then((result) => {
  console.log('User is ',result);
}).catch((e) => console.log('User does not exist'));
