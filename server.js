'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
app.use(bodyParser.urlencoded({'extended': false}));
app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));


mongoose.connect(process.env.MONGO_URL);


app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
const appUrl = "localhost:3000/";

var siteSchema = new mongoose.Schema({
  originalUrl : String,
  shortUrl : String,
  uniqueId: Number
});

const Site = mongoose.model('Site', siteSchema);

var createAndSaveSite = 

app.get("/new/:originalUrl", (req, res) => {
  var { originalUrl } = req.params;
  var uniqueId = new Date().getTime();
  var shortUrl = appUrl + uniqueId;
  const newSite = new Site({
    originalUrl: originalUrl,
    shortUrl: shortUrl,
    uniqueId: uniqueId
  });
  
  newSite.save((err, data) => {
    if(err) {console.log("error when inserting data");}
    var obj = {
      original_url: data.originalUrl,
      short_url: data.shortUrl
    }
    res.send(obj);
  });
});

app.get("/:uniqueId", (req, res) => {
  let { uniqueId } = req.params;
  Site.find({uniqueId: uniqueId}, (err, data) => {
    if(err) {res.send(err)}
    if(data == "") { res.send("no matching result")}
    res.send(data);
  });
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});