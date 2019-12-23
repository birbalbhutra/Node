var express = require('express')
var app = express()

var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var engines = require('consolidate')
//var todos = require('./todos.json')
var cors = require('cors')
var bodyParser = require('body-parser')
const Todo = require('./dbtest.js').Todo;
app.use(cors());

// function getTodosFilePath (id, todos) {
//   return path.join(__dirname, todos, todos + id) + '.json';
// }

// function getTodo (id, todos) {
//   var user = JSON.parse(fs.readFileSync(getTodosFilePath(id, todos), {encoding: 'utf8'}));
//   return user;
// }

// function saveTodo(id, todos, todo) {
//   var fp = getTodosFilePath(id, todos);
//   fs.unlinkSync(fp); // delete the file
//   fs.writeFileSync(fp, JSON.stringify(todo), {encoding: 'utf8'});
// }

// app.engine('hbs', engines.handlebars)

// app.set('views', './views')
// app.set('view engine', 'hbs')

// app.get('/',(req, res)=>{
//   res.json(todos);
// })
app.get('/todos', function (req, res) {
    Todo.find({} , (error , todos) => {
      res.json(todos);
    });
  // var todosArr = [];
  // var todos = req.params.todos;
  // fs.readdir(todos, function (err, files) {
  //   files.forEach(function (file) {
  //     fs.readFile(path.join(__dirname, todos, file), {encoding: 'utf8'}, (err, data) => {
  //       var todo = JSON.parse(data);
  //       todosArr.push(todo);
  //       if (todosArr.length === files.length) 
  //         res.json(todosArr);
  //     })
  //   })
  // })
})

app.get('/todos/:id', function (req, res) {
  var id = req.params.id;
    Todo.find({id: id} , (error , todos) => {
      res.json(todos[0]);
    });
  // var id = req.params.id
  // var todos = req.params.todos
  // var todo = getTodo(id, todos)
  // res.send(todo);
})

app.put('/todos/:id', bodyParser.json(), function (req, res) {
  var id = req.params.id;
  var todos = req.params.todos;
    Todo.find({id: id} , (error , todos) => {
      console.log(todos);
      let todo = todos[0];
      Object.assign(todo , req.body);
      Todo.findOneAndUpdate({id: id} , todo , () => {});
      res.json(todo);
    });
  // var id = req.params.id
  // var todos = req.params.todos
  // var todo = getTodo(id, todos)
  // todo.userId = req.body.userId ? req.body.userId : todo.userId
  // todo.title = req.body.title ? req.body.title : todo.title
  // todo.completed = req.body.completed ? req.body.completed : todo.completed
  // saveTodo(id, todos, todo)
  // res.json(todo)
})

app.post('/todos/', bodyParser.json(), function(req,res){
  var todos = req.params.todos;
  Todo.find({} , (error , todos) => {
    let id = todos.reduce((max , curr) => {
      max = curr.id > max ? curr.id : max;
      return max;
    } , todos[0].id);
    data = {"userId": 0, "id": id, "title": "", "completed": false};
    Object.assign(data , req.body);
    data.id = id + 1;
    // console.log(data);
    Todo.create(data , (error , new_todo) => {
      console.log(new_todo);
      res.json(new_todo);
    })
  })
  // var todos = req.params.todos;
  // var id = 0;
  // fs.readdir(todos, (err, files) => {
  //   var todo = {"userId": "", "id": id, "title": "", "completed": false};
  //   id = files.length + 1;
  //   todo.id = id;
  //   todo.userId = req.body.userId ? req.body.userId : todo.userId;
  //   todo.title = req.body.title ? req.body.title : todo.title;
  //   todo.completed = req.body.completed ? req.body.userId : todo.completed;
  //   var fp = todos + "/" + todos + id + '.json';
  //   fs.open(fp , "w" , () => {});
  //   // console.log("debug")
  //   saveTodo(id, todos, todo);
  //   res.json(todo);
  // });
})
// app.post('/:todos/', bodyParser.json(), function(req,res){
//   var todos = req.params.todos;
//   var id = 0;
//   fs.readdir(todos, (err, files) => {
//     var todo;
//     id = files.length + 1;
//     // while(id === )
//     todo = {"userId": "", "id": id, "title": "", "completed": false}
//     Object.assign(todo , req.body)
//     // todo = req.body;
//     todo.id = id;
//     // todo.userId = req.body.userId ? req.body.userId : todo.userId;
//     // todo.title = req.body.title ? req.body.title : todo.title;
//     // todo.completed = req.body.completed ? req.body.userId : todo.completed;
//     var fp = todos + "/" + todos + id + '.json';
//     fs.open(fp , "w" , () => {});
//     // console.log("debug")
//     saveTodo(id, todos, todo);
//     res.json(todo);
//   });
// })
// app.post('/:todos', bodyParser.json(), (req,res)=>{
//   var todos = req.params.body;
//   var id;
//   var todo;
//   fs.readdir(todos, (err, files) => {
//     id += files.length;
//     todo = req.body;
//     todo.id = id;
//     todo.userId = 
//   })



// app.delete('/:todos/:id', function (req, res) {
//   var fp = getTodosFilePath(req.params.id, req.params.todos)
//   fs.unlinkSync(fp) // delete the file
//   res.sendStatus(200)
// })

var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})



