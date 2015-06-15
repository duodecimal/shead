var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = 3000;

app.use(express.static(__dirname + '/SwappyMonkaWebsite'));

http.listen(port, function () {
  console.log("server is running now at http://localhost:"+port);
});