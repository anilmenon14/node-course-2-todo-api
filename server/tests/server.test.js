const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
// no need to require mocha or nodemon

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')


const todos = [{
  _id: new ObjectID(),
  text : 'First test todo'
},{
  _id: new ObjectID(),
  text : 'Second test todo'
}]


// This function will be called before each of the test cases. If you need prereqs to be done before each test, this can be used
beforeEach((done) => {
  Todo.remove({}).then(() => {; // wiping DB clean
  return Todo.insertMany(todos)  // adding 2 records from todos mentioned
}).then(() => done());
})

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
