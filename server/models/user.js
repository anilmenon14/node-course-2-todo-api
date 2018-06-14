var mongoose = require('mongoose')

//Model, i.e. schema definition below
//Table name is User , however mongooose will lowercase it and pluralize , hence expect name to be 'users' in Robomongo
var User = mongoose.model(('User'),{
first_name : {
 type: String,
 required: true,
 minlength : 1,
 trim : true ,// remove trailing and leading spaces
},
last_name : {
 type: String,
 required: true,
 minlength : 1,
 trim : true ,// remove trailing and leading spaces
},
email_address: {
 type: String,
 required: true,
 minlength : 1,
 trim : true ,// remove trailing and leading spaces
}
}
)

// // **example of creating new document**
// var newUser = new User(
// {
// first_name : "John",last_name : "Petrucci",email_address :"John.Petrucci@GodLevel.com"
// }
// )
//
//
// // **example of saving/commiting above document to DB**
// newUser.save().then((doc) => {
//  console.log('Saved User',doc);
// },(err) => {
//  console.log('Unable to save User',err);
// });

module.exports = {
User
}
