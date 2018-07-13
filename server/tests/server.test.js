const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
// no need to require mocha or nodemon

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {todos,populateTodos,users,populateUsers} = require('./seed/seed')




// This function will be called before each of the test cases. If you need prereqs to be done before each test, this can be used
beforeEach(populateUsers);
beforeEach(populateTodos);


//POST todos testing

describe('**Testing posting using POST /todos', ()=> {
   it('should create a new todo',(done) => {
var text = 'Test todo text'

  request(app)
  .post('/todos')
  .send({text})
  .expect(200)
  .expect ((res) => {
      expect(res.body.text).toBe(text);
        })
  .end((err,res) => {
    if (err) {
      return done(err);
    }
    Todo.find({text:text}).then((todos) => {  // searching only for param of text as the variable text defined. this way test passes despite beforeEach adding 2 more documents
      expect(todos.length).toBe(1);
      expect(todos[0].text).toBe(text);
      done();
    }).catch((e)=> done(e));
  });
});

it('should not create todo with invalid body data',(done) => {
     request(app)
     .post('/todos')
     .send({})
     .expect(400)
     .end((err,res) => {
       if (err) {
         return done(err);
       }
       Todo.find().then((todos) => {
         expect(todos.length).toBe(2);
         done();
       }).catch((e)=> done(e));

     });

});

});


//GET all todos testing

describe('**Testing retrieving using GET /todos',() => {

it('Should retrieve data back',(done) => {



request(app)
.get('/todos')
.expect(200)
.expect((res) => {
  expect(res.body.todos.length).toBe(2)
})
.end((err,res) => {
  if (err) {
    return done(err);
  }
  return done();
});


})

});

//GET todos by ID  testing

describe('**Testing for retrieving using GET todos/:id ',() => {

//Scenario 1 : Pass case with valid ID that exists in DB

it ('Should retrieve data back and status 200 for valid ID',(done) => {


request(app)
.get('/todos/'+todos[0]._id.toHexString())
.expect(200)
.expect((res)=> {
  expect(res.body.todo.text).toBe(todos[0].text)
})
.end((err,res) => {
  if (err){
    return done(err);
  }
  return done();
});

})

//Scenario 2 : Fail cause with invalid ID

it ('Should not retrieve data back and show status 404 for invalid ID',(done) => {


request(app)
.get('/todos/'+todos[0]._id.toHexString()+"11111")
.expect(404)
.end((err,res) => {
  if (err){
    return done(err);
  }
  return done();
});

})

//Scenario 3 : Fail case with valid ID that doesn't exist in DB

it ('Should not retrieve data back and show status 404 for valid ID not existing in DB',(done) => {

//  Unique valid ID that isn't in the todos collection
fail_id = new ObjectID();


request(app)
.get('/todos/'+fail_id.toHexString())
.expect(404)
.end((err,res) => {
  if (err){
    return done(err);
  }
  return done();
});

});

});

// DELETE todos/:id test cases

describe ("** Testing for deleting todos using IDs ",()=> {



// Scenaio 1 : It should remove a todos

it('Should remove a todo if valid ID provided which exists in DB', (done)=> {

var hexID = todos[0]._id.toHexString();

  request(app)
  .delete('/todos/'+hexID)
  .expect(200)
  .expect((res)=> {
    expect(res.body.todo.text).toBe(todos[0].text)
  })
  .end((err,res) => {
    if (err){
      return done(err);
    }
    Todo.findById(hexID).then((todo) => {
      expect(todo).toNotExist();
      done();

    }).catch((e)=> done(e));
  });



});
// Scenario 2 : It should return 404 if todo not found
it('Should return 404 if valid ID provided and todo not found', (done)=> {
  fail_id = new ObjectID();


  request(app)
  .delete('/todos/'+fail_id.toHexString())
  .expect(404)
  .end((err,res) => {
    if (err){
      return done(err);
    }
    return done();
  });

});
// Scenario 3 : It should return 404 if id is invalid
it('Should return 404 if invalid ID provided', (done)=> {


    request(app)
    .delete('/todos/'+todos[0]._id.toHexString()+"11111")
    .expect(404)
    .end((err,res) => {
      if (err){
        return done(err);
      }
      return done();
    });

});

})


// PATCH todos/:id test cases

describe("** Testing updates using PATCH when passing IDs",() => {

it ('Should return status 200 and update the value ',(done) => {

var hexID = todos[0]._id.toHexString();
text = "Hello, this is updated",
completed = true;


request(app)
.patch('/todos/'+hexID)
.send({text,completed})
.expect(200)
.end((err,res) =>{
  if (err){
    return done(err);
  }
  Todo.findById(hexID).then((todo)=> {
    expect(text).toBe(todo.text);
    expect(todo.completed).toBe(true);
    expect(typeof todo.completedAt).toBe('number');
    done()
  })
});
});


it ('Should set completedAt as null if completed==false ',(done) => {

var hexID = todos[1]._id.toHexString();
text = "Hello, this is updated"
completed = false;

request(app)
.patch('/todos/'+hexID)
.send({text,completed})
.expect(200)
.end((err,res) =>{
  if (err){
    return done(err);
  }
  Todo.findById(hexID).then((todo)=> {
    expect(text).toBe(todo.text);
    expect(todo.completed).toBe(false);
    expect(todo.completedAt).toBe(null);
    return done()
  })
});


});



it ('Should return 404 if valid ID provided and todo not found ',(done) => {
  fail_id = new ObjectID();
  text = "Hello, this is updated"

  request(app)
  .patch('/todos/'+fail_id.toHexString())
  .send({text})
  .expect(404)
  .end((err,res) =>{
    if (err){
      return done(err);
    }
    return done();
    })
  });



it ('Should return 404 if invalid ID provided ',(done) => {

hexID = todos[0]._id.toHexString();
text = "Hello, invalid testing";

request(app)
.patch('/todos/'+hexID+"1111111")
.send({text})
.expect(404)
.end((err,res)=> {
  if (err){
    return done(err);
  }
  return done();
});

});

});


describe ('Testing for GET /users/me route',() => {

it('should return user if authenticated ',(done) => {

request(app)
.get('/users/me')
.set('x-auth',users[0].tokens[0].token)
.expect(200)
.expect((res) => {
  expect(res.body._id).toBe(users[0]._id.toHexString());
  expect(res.body.email_address).toBe(users[0].email_address);
}).end(done);


});// end of test case 1 in GET users/me

it('should return 401 if not authenticated',(done) => {
  request(app)
  .get('/users/me')
  .expect(401)
  .expect((res) => {
    expect(res.body._id).toEqual(null);
    expect(res.body.email_address).toEqual(null);
  }).end(done);
});// end of test case 2 in GET users/me

}); // end of describe GET /users/me


describe('Testing for POST /users route', () => {

it('should create a user',(done)=>{

  var first_name = "Mike";
  var last_name = "Mangini";
  var email_address = "mm@dt.com";
  var password = "dt4life"

  request(app)
  .post('/users')
  .send({first_name,last_name,email_address,password})
  .expect(200)
  .expect((res) => {
    expect(res.headers['x-auth']).toExist();
    expect(res.body._id).toExist();
    expect(res.body.email_address).toEqual(email_address);
  }).end((err) => {
    if (err) {
      return done(err)
    }
    User.findOne({email_address}).then((user) => {
      expect(user).toExist();
      expect(user.password).toNotBe(password); //password should not match since they are hasheds
      done();
    }).catch((e) => done(e));

  });
});// end of test case 1 in POST users


it('should return validation errros if request invalid ',(done)=>{

  var first_name = "Mike";
  var last_name = "Mangini";
  var email_address = "mmdt.com";
  var password = "dt4life"

  request(app)
  .post('/users')
  .send({first_name,last_name,email_address,password})
  .expect(400)
  .expect((res) => {
    expect(res.headers['x-auth']).toNotExist();
    expect(res.body._id).toBe(undefined);
    expect(res.body.email_address).toBe(undefined);
  }).end(done);


});// end of test case 2 in POST users
it('should not create user if email is in use',(done)=>{

  var first_name = "Mike";
  var last_name = "Mangini";
  var email_address = users[0].email_address;
  var password = "dt4life"

  request(app)
  .post('/users')
  .send({first_name,last_name,email_address,password})
  .expect(400)
  .expect((res) => {
    expect(res.headers['x-auth']).toNotExist();
    expect(res.body._id).toBe(undefined);
    expect(res.body.email_address).toBe(undefined);
  }).end(done);


});// end of test case 3 in POST users
it('should pass always',(done)=>{done()});// end of test case 4 in POST users

}); // end of describe POST /users


describe ( 'POST /users/login', () => {

it('Should login user and return auth token', (done) => {
request(app)
.post('/users/login')
.send({email_address:users[1].email_address, password:users[1].password})
.expect(200)
.expect((res) => {
  expect(res.headers['x-auth']).toExist();
}).end((err,res) => {
  if (err) {
    return done(err);
  }
  User.findById(users[1]._id).then((user) => {
    expect(user).toExist();
    expect(user.tokens[0]).toInclude({
      access: 'auth',
      token: res.headers['x-auth']

    });
        done();

  }).catch((e) => done(e));;
});


});

it('Should reject invalid login', (done) => {
request(app)
.post('/users/login')
.send({email_address:users[1].email_address, password:users[1].password + 'abcd'})
.expect(403)
.expect((res) => {
  expect(res.header['x-auth']).toNotExist()
}).end((err,res) => {
  if (err) {
    return done(err);
  }
  User.findById(users[1]._id).then((user) => {
    expect(user).toExist();
    expect(user.tokens.length).toBe(0);
        done();

  }).catch((e) => done(e));;

});

});


}); // end of describe POST /users/login
