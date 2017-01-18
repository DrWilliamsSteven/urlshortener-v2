var express = require("express");
var bodyParser = require('body-parser');
var _ = require("underscore");

// for app
var app = express();
var PORT = process.env.PORT || 8080;

// for mongoDB
var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");
var dotenv = require('dotenv');
dotenv.config();
var url = process.env.MONGOLAB_URI;
//console.log("url: " + url + " type of: " + typeof(url));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

// set static views
  app.use(express.static(__dirname + '/views'));
  //Store all HTML files in view folder.
  app.use(express.static(__dirname + '/Scripts'));
  //Store all JS and CSS in Scripts folder.
  
  app.set('view engine', 'ejs');
  app.set('views', './views');

// serve static view
/*
  app.get('/',function(req, res){
    res.sendFile('index.ejs');
    //It will find and locate index.html from View or Scripts
  });
*/

// connect to mongoDB
var db

MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(PORT, () => {
    console.log('listening on port: ' + PORT);
  });
});

app.post('/quotes', (req, res) => {
  console.log("In comes a " + req.method + " to " + req.url);
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database')
    res.redirect('/')
  })
})


app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {quotes: result})
    //console.log(result);
  })
})

/*
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

// testing mongodb
var insertDocument = function(db, callback) {
   db.collection('restaurants').insertOne( {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : new Date("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : new Date("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the restaurants collection.");
    callback();
  });
};

MongoClient.connect(url, function (err, db) {
  if (err) throw err

  db.collection('restaurants').find().toArray(function (err, result) {
    if (err) throw err

    console.log(result)
  })
})
// end mongo testing
*/


/*
// TODO app code, node.js course
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
*/


