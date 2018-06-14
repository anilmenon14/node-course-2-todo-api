var mongoose = require('mongoose')

//Model, i.e. schema definition below
//Table name is Todo, however mongooose will lowercase it and pluralize , hence expect name to be 'todos' in Robomongo
var Todo = mongoose.model('Todo',{
 text : {
// props of text that can be defined. refer to mongoose validators reference documentation
   type: String,
   required: true,
   minlength : 1,
   trim : true ,// remove trailing and leading spaces
 },
 completed : {
// props of completed
  type: Boolean,
  required: false,
  default : false,
 },
 completedAt: {
// props of completedAt
   type : Number,
   default : null,

 }
})

// // **example of creating new document**
// var newTodo = new Todo(
// {
//  text : '  Daily guitar practice  '
// }
// );
//
// // **example of saving/commiting above document to DB**
// newTodo.save().then((doc) => {
//   console.log('Saved todo',doc);
// },(err) => {
//   console.log('Unable to save todo',err);
// });

module.exports = {
Todo
}
