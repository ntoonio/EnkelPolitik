var http = require("http")
var https = require("https")
var express = require("express")
var path = require("path")
var fs = require("fs")

var app = express()

app.use("/views", express.static(path.join(__dirname, 'views')))
app.use("/views/photos", express.static(path.join(__dirname, 'views')))

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
	res.sendFile('views/index.html', {root: __dirname })
})

app.get("/info", function(req, res) {
	res.sendFile('views/info.html', {root: __dirname })
})

app.get("/quiz", function(req, res) {
	res.sendFile('views/quiz.html', {root: __dirname })
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

app.get("/vote", function (req, res) {
	res.send(getVote(req.query.vote))
})

app.listen(3000, function() {
	console.log("Running!")
})
