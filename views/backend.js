var http = require("http");
var https = require("https");
var express = require("express");
var app = express();
var path = require('path');
//var fs = require("fs");
//var index = fs.readFileSync("index.html");

app.use("/views", express.static(path.join(__dirname, 'views')));
app.use("/views/photos", express.static(path.join(__dirname, 'views')));

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

app.get("/", function(req, res) {
	res.sendFile('views/index.html', {root: __dirname })
});

app.get("/info", function(req, res) {
	res.sendFile('views/info.html', {root: __dirname })
});

app.get("/list", function(req, res) {
	const date = new Date()

	const year = date.getFullYear()
	const month = date.getMonth()
	const parlamentYear = month < 7 ? (year - 1) + "/" + year.toString().substr(2) : year + "/" + (year + 1).toString().substr(2)
	
	request("http://data.riksdagen.se/voteringlista/?rm=" + parlamentYear.replace("/", "%2F") + "&bet=&punkt=&valkrets=&rost=&iid=&sz=10&utformat=json&gruppering=votering_id", function (data) {
		//res.send({"voteringar": data.voteringlista.votering, "ar": parlamentYear});
		var sendData = {}
		
		var count = 0;
		data.voteringlista.votering.forEach(function(value) {
			//console.log("Id: " + value.votering_id + " / " + id);
			sendData[count++] = value.votering_id;
			//console.log(JSON.stringify(value))
		})
		
		//console.log(JSON.stringify(sendData));
		res.send(sendData);
	})
});

app.get("/vote", function (req, res) {
	request("http://data.riksdagen.se/votering/" + req.query.vote + "/json", function(data) {
		var responseData = {"title": data.votering.dokument.titel, "dokument": data.votering.dokument, "voteringar": data.votering.dokvotering.votering, "bilaga": data.votering.dokbilaga.bilaga}
		
		console.log("Test: " + req.query.vote + ", " + data.votering.dokbilaga.bilaga.title);// + "," + JSON.stringify(data));
		
		var partyVotes = {"j": {}, "n": {}, "a": {}, "f": {}}
		data.votering.dokvotering.votering.forEach(function(value) {
			var vote = value.rost.toLowerCase().substr(0, 1)
			//console.log(JSON.stringify(value))
			
			if(typeof partyVotes[vote][value.parti] == 'undefined') {
				partyVotes[vote][value.parti] = 1;
				partyVotes["total_" + vote] = 1;
			} else {
				partyVotes[vote][value.parti] += 1;
				partyVotes["total_" + vote] += 1;
			}
		})
		responseData.parti_roster = partyVotes
		res.send(responseData)
	})
})

app.listen(3000, function() {
	console.log("Running!");
});
