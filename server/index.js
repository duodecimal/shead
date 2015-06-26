var fs   = require('fs');
//var exif = require('exif');
//var exif = require('exiftool');
//var ExifImage = require('exif').ExifImage; // not support video
var express = require('express');
//var multer  = require('multer');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var port = 3000;

app.use(express.static(__dirname + '/public'));
//app.use(bodyParser.json({limit: '50mb'}, {uploadDir:'./uploads'}));
app.use(bodyParser.json());


app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//app.use(multer({ dest: './uploads/'}))
//app.use(express.bodyParser({limit: '50mb'}));


app.post('/api/uploadFile', function(req, res){
	//console.log(req);
	// exif(req, function(err, obj){
	//   console.log(obj);
	// })
	//res.send(req);
});

app.post('/file-upload', function(req, res, next) {
    console.log(req.body);
    console.log(req.files);
});

http.listen(port, function () {
  console.log("server is running now at http://localhost:"+port);
});