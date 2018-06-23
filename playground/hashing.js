const jwt = require('jsonwebtoken');



var data = {
  id : 10
};

var token = jwt.sign(data,'123abc')

// Sign is used to create a new token that can be saved on the user model

console.log('Token is :',token);


var decoded = jwt.verify(token,'123abc');

// Verify takes token and the secret key to it as params . It will throw error if either token or secret key (salt) are incorrect

console.log('Decoded :',decoded);
