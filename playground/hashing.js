const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'dtforlife';

// // Below code is to generate password. genSalt is number of iterations of salting before generating. This is needed to prevent brute force attacks.
// bcrypt.genSalt(10,(err, salt)=> {
//   bcrypt.hash(password,salt,(err,hash) => {
//     console.log('Password hash is : ',hash);
//   });
// });

var hashedPassword = "$2a$10$qTen/VyDWUjgeA3OBw5Gr.rg6/Ngbv547BMjo6YiGTeRwzrWoHP1i";

bcrypt.compare(password,hashedPassword,(err,res) => {
  console.log(res);
} )


var data = {
  id : 10
};

var token = jwt.sign(data,'123abc')

// Sign is used to create a new token that can be saved on the user model

console.log('Token is :',token);


var decoded = jwt.verify(token,'123abc');

// Verify takes token and the secret key to it as params . It will throw error if either token or secret key (salt) are incorrect

console.log('Decoded :',decoded);
