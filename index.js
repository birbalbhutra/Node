var express = require('express')
var app = express()

var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var engines = require('consolidate')
//var todos = require('./todos.json')
var bodyParser = require('body-parser')

function getTodosFilePath (id, todos) {
  return path.join(__dirname, todos, todos + id) + '.json'
}

function getTodo (id, todos) {
  var user = JSON.parse(fs.readFileSync(getTodosFilePath(id, todos), {encoding: 'utf8'}))
  return user
}

function saveTodo(id, todos, data) {
  var fp = getTodosFilePath(id, todos)
  fs.unlinkSync(fp) // delete the file
  fs.writeFileSync(fp, JSON.stringify(data), {encoding: 'utf8'})
}

app.engine('hbs', engines.handlebars)

app.set('views', './views')
app.set('view engine', 'hbs')

// app.get('/',(req, res)=>{
//   res.json(todos);
// })
app.get('/:todos', function (req, res) {
  var todosArr = [];
  var todos = req.params.todos;
  fs.readdir(todos, function (err, files) {
    files.forEach(function (file) {
      fs.readFile(path.join(__dirname, todos, file), {encoding: 'utf8'}, (err, data) => {
        var todo = JSON.parse(data);
        todosArr.push(todo);
        if (todosArr.length === files.length) 
          res.json(todosArr);
      })
    })
  })
})

app.get('/:todos/:id', function (req, res) {
  var id = req.params.id
  var todos = req.params.todos
  var todo = getTodo(id, todos)
  res.send(todo);
})

app.put('/:todos/:id', bodyParser.json(), function (req, res) {
  var id = req.params.id
  var todos = req.params.todos
  var todo = getTodo(id, todos)
  todo.userId = req.body.userId ? req.body.userId : todo.userId
  todo.title = req.body.title ? req.body.title : todo.title
  todo.completed = req.body.completed ? req.body.completed : todo.completed
  saveTodo(id, todos, todo)
  res.json(todo)
})

app.post('/:todos/', bodyParser.json(), function(req,res){
  var todos = req.params.todos;
  var id = 0;
  fs.readdir(todos, (err, files) => {
    var todo;
    id = files.length + 1;
    // while(id === )
    todo = req.body;
    todo.id = id;
    todo.userId = req.body.userId ? req.body.userId : todo.userId;
    todo.title = req.body.title ? req.body.title : todo.title;
    todo.completed = req.body.completed ? req.body.userId : todo.completed;
    var fp = todos + "/" + todos + id + '.json';
    fs.open(fp , "w" , () => {});
    // console.log("debug")
    saveTodo(id, todos, todo);
    res.json(todo);
  });
})
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



app.delete('/:todos/:id', function (req, res) {
  var fp = getTodosFilePath(req.params.id, req.params.todos)
  fs.unlinkSync(fp) // delete the file
  res.sendStatus(200)
})

var server = app.listen(3000, function () {
  console.log('Server running at http://localhost:' + server.address().port)
})



