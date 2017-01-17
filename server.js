var express = require("express");
var bodyParser = require('body-parser');
var _ = require("underscore");

// for mongoDB
var mongo = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017/learnyoumongo';
var ip_mongo = process.env.IP;


var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

// for mongoDB testing
var firstNameVal = process.argv[2];
var lastNameVal = process.argv[3];
var doc = {
      firstName: firstNameVal,
      lastName: lastNameVal
    };
    
mongo.connect(ip_mongo, function(err, db) {
      // db gives access to the database
      if(err){
        console.log('There was an error: ' + err);
      } else {
      
    var collection = db.collection('docs');
      
    collection.insert(doc, function(err, data) {
      if(err){
        console.log('There was an error: ' + err);
      } else {
        console.log(JSON.stringify(doc));
      }
      db.close();
    });
  } 
});
// end mongo testing

app.use(express.static(__dirname + '/View'));
//Store all HTML files in view folder.
app.use(express.static(__dirname + '/Scripts'));
//Store all JS and CSS in Scripts folder.

app.get('/',function(request,response){
  response.sendFile('index.html');
  //It will find and locate index.html from View or Scripts
});

app.get('/todos', function(req, res) {
  console.log("In comes a " + request.method + " to " + request.url);
    res.json(todos);
});

app.get('/todos/:id', function(req, res) {
  console.log("In comes a " + request.method + " to " + request.url);
  var todoID = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoID});
  
  if(matchedTodo){
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});

app.post('/todos', function(req, res) {
  console.log("In comes a " + request.method + " to " + request.url);
  var body = _.pick(req.body, 'description', 'completed');
  
  if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }
  
   body.description = body.description.trim();
   body.id = todoNextId++;
   todos.push(body);
   res.json(body);
});


 app.listen(PORT);
