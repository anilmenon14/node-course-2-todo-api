var mongoose = require('mongoose');

mongoose.Promise = global.Promise ;// setting type of Promise that mongoose should use

//DB name is TodoApp
mongoose.connect( process.env.MONGODB_URI);
// Difference between mongodb and mongoose is that mongoose doesn't need a callback to do operations once the DB connect has happened.
// Mongoose takes care of it for you , which is why insert/delete/find/update commands can be wriiten outside above connect function


module.exports = {
mongoose
}
