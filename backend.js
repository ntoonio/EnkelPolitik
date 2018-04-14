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
<<<<<<< HEAD

	const cacheFileName = "cache_" + parlamentYear.replace("/", "") + ".json"

	var usingCache = false

	if (fs.existsSync(cacheFileName)) {
		const content = fs.readFileSync(cacheFileName)
		const cahceTime = JSON.parse(content).timestamp
		const nowTime = Date.now()

		if (JSON.parse(content).timestamp > Date.now() - 7200 * 1000) {
			usingCache = true
			res.send(content)
		}
	}

	if (!usingCache) {
		var voteringar = []

		request("http://data.riksdagen.se/voteringlista/?rm=" + parlamentYear.replace("/", "%2F") + "&bet=&punkt=&valkrets=&rost=&iid=&sz=10&utformat=json&gruppering=votering_id", function (data) {
			for (v in data.voteringlista.votering){
				const voteringId = data.voteringlista.votering[v].votering_id

				getVote(voteringId, function (vote) {
					voteringar.push(vote)

					if (voteringar.length == data.voteringlista.votering.length) {

						voteringar.sort(function (a, b) {
							if (a.dokument.publicerad < b.dokument.publicerad) return 1
							if (a.dokument.publicerad > b.dokument.publicerad) return -1
							return 0
						})

						const output = JSON.stringify({"voteringar": voteringar, "ar": parlamentYear, "timestamp": Date.now()})
						fs.writeFile(cacheFileName, output, function () {})
						res.send(output)
					}
				})
			}
=======
	
	request("http://data.riksdagen.se/voteringlista/?rm=" + parlamentYear.replace("/", "%2F") + "&bet=&punkt=&valkrets=&rost=&iid=&sz=10&utformat=json&gruppering=votering_id", function(data) {
		//res.send({"voteringar": data.voteringlista.votering, "ar": parlamentYear});
		var sendData = {}
		
		var count = 0;
		data.voteringlista.votering.forEach(function(value) {
			//console.log("Id: " + value.votering_id + " / " + id);
			sendData[count++] = value.votering_id;
			//console.log(JSON.stringify(value))
>>>>>>> origin/master
		})
		
		//console.log(JSON.stringify(sendData));
		res.send(sendData);
	})
});

<<<<<<< HEAD
function getVote(id, response) {
    request("http://data.riksdagen.se/voteringlista/?bet=&punkt=&valkrets=&rost=&id=" + id + "&sz=500&utformat=json&gruppering=", function (data) {
		request("http://data.riksdagen.se/votering/" + id + "/json", function (data2) {
			var responseData = {"dokument": data2.votering.dokument, "bilaga": data2.votering.dokbilaga}

			var partyVotes = {"j": {}, "n": {}, "a": {}, "f": {}}

			for (d in data.voteringlista.votering) {
				const voteData = data.voteringlista.votering[d]

				const vote = voteData["rost"].toLowerCase().substr(0, 1)
				partyVotes[vote][voteData["parti"]] == undefined ? partyVotes[vote][voteData["parti"]] = 1 : partyVotes[vote][voteData["parti"]] += 1
				partyVotes["total_" + vote] == undefined ? partyVotes["total_" + vote] = 1 : partyVotes["total_" + vote] += 1
			}

			responseData.parti_roster = partyVotes

			response(responseData)
=======
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
>>>>>>> origin/master
		})
		responseData.parti_roster = partyVotes
		res.send(responseData)
	})
})

app.listen(3000, function() {
<<<<<<< HEAD
	console.log("Running!")
})
/*function Calc() {
var l= Votes(10,4,1,1);
	var OP=prompt("what is your opinion on this draft");
	var IMP_STRING=prompt("how impotant do you consider this draft to be");

	var DIN_OP=parseFloat(OP);
	var IMP=parseFloat(IMP_STRING);
	var PO=1;

var Parties[0,0,0,0,0,0,0,0,0];
var Ledamöter[0,0,0,0,0,0,0,0,0,0,0,0];
var Ledamöter_Röster[0,0,0,0,0,0,0,0,0,0,0,0,0,][0,0,0,0,0,0,0,0,0,0,0,0,0,];
var sum = 0;
var SumOfYes=0;
var SumOfNo=0;
for(var j=0; j<=Ledamöter.length-1; j++) {

	sum+=Ledamöter[j];
}
for(var k=0; k<=Ledamöter_Röster.length-1; k++) {
	for(var m=0; l<=Ledamöter_Röster.length-1; l++) {
	if(Ledamöter_Röster[k][l]==1) {

		SumOfYes++;
	}
	else if(Ledamöter_Röster[k][l]==0) {

		SumOfNo++;
	}
	}
}


for(var i=1; i<=Parties.length-1; i++) {
	Parties[i]= MumsKorv(DIN_OP,Votes(Ledamöter[i],sum,SumOfYes,SumOfNo),IMP);

}
}
}
function Votes( ledamöter,  platser,  ja,  nej) {
	return platser/(ledamöter-nej);
}

function MumsKorv( d,  p,  v) {
		return d*p*v;
	}



}*/
=======
	console.log("Running!");
});
>>>>>>> origin/master
