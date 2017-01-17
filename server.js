var express = require("express");
var http = require("http");
var url = require("url");
var path = require("path");

var app = express();
var port = process.env.PORT || 8080

var result;



app.get('/todos', function(req, res) {
  console.log("In comes a " + req.method + " to " + req.url);
  
  var todoID = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoID});
  
  if(matchedTodo){
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

app.post('/todos', function(req, res) {
  var body = req.body;
  
  if(!_.isBoolean(body.completed) || !_.isString(body.description) || ) {
    return res.status(400).send();
    
  }
   body.id = todoNextId++;
   todos.push(body);
   res.json(body);
});



// Send "timestamp result"
app.use(function(request, response) {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(result));
});







 app.listen(port);
