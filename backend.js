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
        console.log(data)
		response(JSON.parse(data))
        console.log("---")
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
    
    var voteringar = []

	request("http://data.riksdagen.se/voteringlista/?rm=" + parlamentYear.replace("/", "%2F") + "&bet=&punkt=&valkrets=&rost=&iid=&sz=500&utformat=json&gruppering=votering_id", function (data) {
		//res.send({"voteringar": data.voteringlista.votering, "ar": parlamentYear});
        for (v in data.voteringlista.votering){
            const voteringId = data.voteringlista.votering[v].votering_id
            console.log(voteringId + " getVote = " + getVote(voteringId))
            voteringar.push(JSON.parse(getVote(voteringId)))
            console.log("--",voteringar)
        }
        voteringar.sort(function (a,b){
            if(a.datum < b.datum) return -1;
            if(a.datum > b.datum) return 1;
            return 0
        })
        res.send(JSON.stringify(voteringar))
	})
});

function getVote(id){
    request("http://data.riksdagen.se/votering/" + id + "/json", function (data) {
		var responseData = {"dokument": data.votering.dokument, "voteringar": data.votering.dokvotering.votering, "bilaga": data.votering.dokbilaga.bilaga}
        
        console.log(data)

		var partyVotes = {"j": {}, "n": {}, "a": {}, "f": {}}
	
		for (d in data.votering.dokvotering.votering) {
			const voteData = data.votering.dokvotering.votering[d]
			
			const vote = voteData["rost"].toLowerCase().substr(0, 1)
			partyVotes[vote][voteData["parti"]] == undefined ? partyVotes[vote][voteData["parti"]] = 1 : partyVotes[vote][voteData["parti"]] += 1
			partyVotes["total_" + vote] == undefined ? partyVotes["total_" + vote] = 1 : partyVotes["total_" + vote] += 1
		}

		responseData.parti_roster = partyVotes
        
		return responseData
	})
}

app.get("/vote", function (req, res) {
	resp.send(getVote(req.query.vote))
})
  
app.listen(3000, function() {
	console.log("Running!");
});