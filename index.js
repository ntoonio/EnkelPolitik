var http = require("http");
var express = require("express");
var app = express();
//var fs = require("fs");
//var index = fs.readFileSync("index.html");

app.get("/", function(req, res) {
	res.send("Hello World!");
});
  
app.listen(3000, function() {
	console.log("Example app listening on port 3000!");
});