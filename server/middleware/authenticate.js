var {User} = require('./../models/user');

var authenticate = (req,res,next) => {

  var token = req.header('x-auth'); //pulling up the token passed by the users

  User.findByToken(token).then((user) => {
    if (!user) {
  return Promise.reject()
    }
req.user = user;
req.token = token;

next();
  }).catch((e)=> {
    res.status(401).send(e); // 401 means auth failed
  });


};

module.exports = {
  authenticate
}
