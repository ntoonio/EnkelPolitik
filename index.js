var http = require("http")
var https = require("https")
var express = require("express")
var path = require("path")
var fs = require("fs")

var app = express()

app.use("/views", express.static(path.join(__dirname, "views")))
app.use("/views/photos", express.static(path.join(__dirname, "views")))
///////// 




function calc(parties, members, memberVotes) {
	var opinion = parseFloat(prompt("what is your opinion on this draft"))
	var importance = parseFloat(prompt("how impotant do you consider this draft to be"))

	var sum = 0
	var sumOfYes = 0
	var sumOfNo = 0

	for (var j = 0; j <= members.length - 1; j++) {
		sum += members[j]
	}

	for (var k= 0; k <= memberVotes.length - 1; k++) {
		for (var l = 0; l <= memberVotes.length - 1; l++) {
			if (memberVotes[k][l] == 1) {
				sumOfYes++
			}
			else if (memberVotes[k][l] == 0) {
				SumOfNo++
			}
		}
	}

	for (var i = 1; i <= parties.length - 1; i++) {
		const p = members[i] / (sum - sumOfNo)
		parties[i] = opinion * p * importance
	}

	return parties
}

var parties = []
var memebers = []
var memberVotes = []

//console.log(calc(parties, members, memberVotes))



////////////////



function request(url, response) {
	http.get(url, (res) => {
	let data = ""

	res.on("data", (chunk) => {
		data += chunk
	})

	res.on("end", () => {
		response(JSON.parse(data))
	})

	}).on("error", (err) => {
		console.log("Error: " + err.message)
	})
}

app.get("/", function(req, res) {
	res.sendFile("views/index.html", {root: __dirname })
})

app.get("/info", function(req, res) {
	res.sendFile("views/info.html", {root: __dirname })
})

app.get("/quiz", function(req, res) {
	res.sendFile("views/quiz.html", {root: __dirname })
})

app.get("/list", function(req, res) {
	const date = new Date()

	const year = date.getFullYear()
	const month = date.getMonth()
	const parlamentYear = month < 7 ? (year - 1) + "/" + year.toString().substr(2) : year + "/" + (year + 1).toString().substr(2)

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
		})
	}
})

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
		})
	})
}

app.get("/getQuiz", function (req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.sendFile("quiz.json", {root: __dirname });
	/*res.send({
		"quiz": [
			{
				"law": "Housing aid",
				"description": "More than 6.9 billion sek from the state budget for 2018 goes to the area of ​​social planning, housing supply and construction and consumer policy. the Most money goes to investment support to organize rental housing and housing for students, 3.2 billion kronor. 1.3 billion sek goes to municipalities for increased housing construction and  1 billion sek goes to energy efficiency and renovation of multi-family houses and outdoor environments.",
				"vote": {
					"yes": {
						"S": "102",
						"M": "5",
						"MP": "20",
						"C": "5",
						"V": "19",
						"KD": "1"
					},
					"no": {
						"SD": "41"
					}
				}
			},
				{
				"law": "equality and the establishment of refugees ",
				"description": "In the report, the Committee on Employment and Social Affairs deals with the Government's proposal in the 2016 budget bill in the field of equality and new immigrants' expatriation and alternative proposals for appropriations in the area of ​​expenditure from m,SD, C, L and KD. The budget bill for 2016 is based on an agreement between the government parties and V. Furthermore, it is proposed to abolish the system of launchers.",
				"vote": {
					"yes": {
						"S": "104",
						"M": "19",
						"MP": "24",
						"C": "9",
						"V": "19",
						"L": "2",

					},
					"no": {
						"SD": "39"
					}
				}
			},
	      {
				"law": "Workplace regulations and working hours",
				"description": "",
				"vote": {
					"yes": {
						"S": "104",
						"M": "19",
						"MP": "24",
						"C": "9",
						"V": "19",
						"L": "2",

					},
					"no": {
						"SD": "39"
					}
				}
			},
		]
	});*/
})

app.get("/vote", function (req, res) {
	getVote(req.query.vote, function (data) {
		res.send(data)
	})
})

app.listen(3000, function() {
	console.log("Running!")
})
