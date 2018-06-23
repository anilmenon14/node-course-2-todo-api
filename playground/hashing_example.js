const {SHA256} = require('crypto-js');


var message = "I am user number 3"

var hash = SHA256(message).toString();

console.log('Message: ',message);
console.log('Hash : ',hash);


var data = {
 id : 4,
} ;

var token = {
data,
hash : SHA256(JSON.stringify(data) + 'some salt').toString()
}

// Salting is done to ensure that client cannot fool server .
// For E.g. if I am user 4 and want to delete user 5's data , I shouldn't be able to send hashed token for id of 5 .
// To prevent above , the server adds 'salt' before it sends to client as its token, i.e. a secret key to the text to hash it. The client doesn't know the salt , hence can't fool the server.

 console.log('Original Token hash :',token.hash);

 // What happens when someone tries to fool the system

 token.data.id = 5;
 token.data.hash = SHA256(JSON.stringify(token.data)).toString(); // Person doesnt know the salt to fool the system


 var resultHash =  SHA256(JSON.stringify(token.data) + 'some salt').toString();

 if (resultHash===token.hash){
   console.log('Data has not been changed. Token is good');
 } else {
   console.log('Data has been manipulated. Be careful');
 }
