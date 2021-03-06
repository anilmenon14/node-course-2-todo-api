const mongoose = require('mongoose')
const validator = require('validator'); // npm lib with several inbuilt validators
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// Using Schema mongoose method to be able to add methods onto the model created. Cannot be done using mongoose.model alone.
var UserSchema = new mongoose.Schema({
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
 unique: true,
 validate:
 {
   validator: validator.isEmail,
   message: `{VALUE} is not a valid email address`
 }
},
password: {
 type: String,
 required: true,
 minlength: 6
},
tokens: [{
access:{
type: String,
required: true
},
token: {
type: String,
required: true
}
}]
}
);

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.methods.toJSON = function() {
var user = this ;
var userObject = user.toObject(); // converting to regular object with properties of the documents exist. Else mongoose props also are on the user.

return _.pick(userObject, ['_id','first_name','last_name','email_address'])

};

// Adding 'instance' methods . i.e. methods available to the instance
UserSchema.methods.generateAuthToken = function () {
var user = this; // defining the context of 'this' in the function
var access = 'auth';
var token = jwt.sign({_id : user._id.toHexString(),access},process.env.JWT_SECRET).toString(); //abc123 is predefined salt

user.tokens = user.tokens.concat([{access, token}]);  // Ensures that new token is added if existing one already is present

return user.save().then(() => {
  return token;
  // returning it back to server.js file. Hence return from the function overall is the stringified version of the token
});
};




//statics are Model methods. i.e. , applied on the model and not on the document.

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token,process.env.JWT_SECRET); // abc123 is salt defined above
  }
  catch (e) {
    // this block below ensures a reject is sent back as a Promise
    return new Promise((resolve,reject) =>
    reject ('Invalid token send. Auth failed!')
    // can also be written as 'return Promise.reject('Error text')'
  )};

  return User.findOne({
    "tokens.0.token" : token,
    _id : decoded._id,
    'tokens.access' : 'auth'
  }).then((user) => {
    if (!user) {
  return Promise.reject('User does not exist in the database')
    }
    return _.pick(user, ['_id','first_name','last_name','email_address']);
  })

};

UserSchema.statics.findbyCreds = function(email,password) {
var User = this;
  return User.findOne({email_address:email})
  .then((user) => {

    if(!user) {
      return Promise.reject();
    };

    return new Promise((resolve,reject) => {
      bcrypt.compare(password,user.password,(err,res) => {
        if(res){
          resolve(user);
        }
        else{
          reject();
        }
      });
    });




  });

      next();
    };

// Mongoose Middleware for password hashing
// pre can be used to manipulate data before an action. Here the data can be altered before 'save' is called to commit. Hence password can be hashed if the password field is being modified by the POST/PATCH reqeust

UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {

    bcrypt.genSalt(10, (err,salt)=> {
      bcrypt.hash(user.password,salt,(err,hash) =>{
        user.password = hash;
        next();
      })
    })

  } else {
    next();
  };

})



//Model, i.e. schema definition below
//Table name is User , however mongooose will lowercase it and pluralize , hence expect name to be 'users' in Robomongo
var User = mongoose.model(('User'),UserSchema)


module.exports = {
User
}
