const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// // remove with curly braces will remove ALL
//
// Todo.remove({}).then((result) => {
//   console.log(result);
// }, (err) => {
//   console.log('Cannot remove this crap',err);
// })


// //findOneandRemove
// // Advantage is that we can find which one got removed in log as part of callback result
//
// Todo.findOneandRemove({_id : '5b261d8dafa524844131bc06'}).then((todo) => {
// console.log(todo);
// })

//findByIdAndRemove

Todo.findByIdAndRemove('5b261d8dafa524844131bc06').then((todo) => {
console.log(todo);
}).catch((e) => console.log(e));
