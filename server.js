// following the fantastic tutorial by:
//https://zellwk.com/blog/crud-express-mongodb/

var express = require("express");
var bodyParser = require('body-parser');
var _ = require('underscore');
var validate = require("validate.js");

// for app
var app = express();

var dotenv = require('dotenv');
dotenv.config();
var uri = process.env.MONGODB_URI;
var PORT = process.env.PORT || 8080;

// for mongoDB
var MongoClient = require('mongodb').MongoClient;
//var assert = require("assert");

//var nextURLID = 1;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// set static views
  app.use(express.static(__dirname + '/views'));
  //Store all HTML files in view folder.
  app.use(express.static(__dirname + '/Scripts'));
  //Store all JS and CSS in Scripts folder.
  app.use(express.static('public'));
  
  app.set('view engine', 'ejs');
  app.set('views', './views');
  
// connect to mongoDB
var db;

MongoClient.connect(uri, (err, database) => {
  if (err) return console.log(err);
  db = database;
  app.listen(PORT, () => {
    console.log('listening on port: ' + PORT);
  });
});

app.post('/new', (req, res) => {
  console.log("In comes a " + req.method + " to " + req.url);
  var body = _.pick(req.body, 'original_url');
  
  if(!_.isString(body.original_url) || body.original_url.trim().length === 0) {
    return res.status(400).send();
  }
  body.original_url = body.original_url.trim();
  
  if(validate({website: body.original_url}, {website: {url: true}}) === undefined) {

  // check if already in db
  
  db.collection('shorturl').save(body, (err, result) => {
    if (err) return console.log(err);
    console.log('saved to database');
    
    db.collection('shorturl').update(
   { "_id" : body._id },
   {$set: {"short_url": body._id.toString().slice(18,24)}
    });
  });
    
  res.redirect('/');

  } else {
    
    //res.json('That is not a valid url');
    
    db.collection('shorturl').find().toArray((err, result) => {
    if (err) return console.log(err);
    var error_msg = 'That is not a valid url';
    res.render('index.ejs', {urls: result, error: error_msg, display: 'block'});
  });
  
    
  }
});

 app.get('/:short_url', function(req, res) {
    console.log("In comes a " + req.method + " to " + req.url);
    console.log(req.query);
    var entered_url = req.query.short_url;
     db.collection('shorturl').find({short_url: entered_url}).each((err, result) => {
        if (err) return console.log(err);
        if (result) {
        
        res.writeHead(302, {'Location': result.original_url});
        res.end();
        return false; 
          
        }
    });
});
 
 
app.get('/', (req, res) => {
  db.collection('shorturl').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.render('index.ejs', {urls: result, error: null, display: 'none'});
    //console.log(result);
  });
});

/*
app.delete('/delete', (req, res) => {
  console.log("In comes a " + req.method + " to " + req.url);
  db.collection('shorturl').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err);
    res.json('A url got deleted');
  });
});

*/
