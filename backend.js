var http = require("http");
var https = require("https");
var express = require("express");
var app = express();
//var fs = require("fs");
//var index = fs.readFileSync("index.html");

function request(url, response) {
	http.get(url, (resp) => {
	let data = "";
	
	resp.on("data", (chunk) => {
		data += chunk;
	});
	
	resp.on("end", () => {
		response(JSON.parse(data))
	});
	
	}).on("error", (err) => {
		console.log("Error: " + err.message);
	});
}

app.get("/list", function(req, res) {
	const date = new Date()
	
	const year = date.getFullYear()
	const month = date.getMonth()
	const parlamentYear = month < 7 ? (year - 1) + "/" + year.toString().substr(2) : year + "/" + (year + 1).toString().substr(2)

	request("http://data.riksdagen.se/voteringlista/?rm=" + parlamentYear.replace("/", "%2F") + "&bet=&punkt=&valkrets=&rost=&iid=&sz=500&utformat=json&gruppering=votering_id", function (data) {
		res.send({"votes": data.voteringlista.votering, "year": parlamentYear});
	})
});

app.get("/vote", function (req, res) {
	request("http://data.riksdagen.se/votering/" + req.query.vote + "/json", function (data) {
		res.send(data.votering)
	})
})
  
app.listen(3000, function() {
	console.log("Running!");
});