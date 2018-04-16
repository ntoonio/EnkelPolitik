$.getJSON("/list", function(datalist) {
	for (var i = 0; i < datalist.voteringar.length; i++) {
		const data = datalist.voteringar[i];
		
		const voteDiv = document.createElement("div")
		document.getElementById("votes").appendChild(voteDiv)
		voteDiv.classList.add("voteDiv")
		voteDiv.innerHTML += `
		<div class="voteInformation">
			<a href="` + data.bilaga.fil_url + `" target="_blank"><h3>` + data.dokument.titel + `</h3></a>
			<p class="subTitle">` + data.dokument.typrubrik + `</p>
		</div>`;
		
		// Table
		const table = document.createElement("table")
		voteDiv.appendChild(table)
		table.classList.add("votesTable")

		const headerRow = document.createElement("tr")
		table.appendChild(headerRow)

		const yesHeader = document.createElement("th")
		headerRow.appendChild(yesHeader)
		yesHeader.innerText = "Yes"

		const noHeader = document.createElement("th")
		headerRow.appendChild(noHeader)
		noHeader.innerText = "No"
		
		const abstainHeader = document.createElement("th")
		headerRow.appendChild(abstainHeader)
		abstainHeader.innerText = "Abstain"
		
		const absentHeader = document.createElement("th")
		headerRow.appendChild(absentHeader)
		absentHeader.innerText = "Absent"

		const contentRow = document.createElement("tr")
		table.appendChild(contentRow)

		const yesVotesTd = document.createElement("td")
		contentRow.appendChild(yesVotesTd)
		yesVotesTd.classList.add("votesContainer")
		
		const noVotesTd = document.createElement("td")
		contentRow.appendChild(noVotesTd)
		noVotesTd.classList.add("votesContainer")

		const abstainVotesTd = document.createElement("td")
		contentRow.appendChild(abstainVotesTd)
		abstainVotesTd.classList.add("votesContainer")
		
		const absentVotesTd = document.createElement("td")
		contentRow.appendChild(absentVotesTd)
		absentVotesTd.classList.add("votesContainer")

		const totalRow = document.createElement("tr")
		table.appendChild(totalRow)

		const yesTotalTd = document.createElement("td")
		totalRow.appendChild(yesTotalTd)
		yesTotalTd.classList.add("votesTotalData")
		
		const noTotalTd = document.createElement("td")
		totalRow.appendChild(noTotalTd)
		noTotalTd.classList.add("votesTotalData")

		const abstainTotalTd = document.createElement("td")
		totalRow.appendChild(abstainTotalTd)
		abstainTotalTd.classList.add("votesTotalData")
		
		const absentTotalTd = document.createElement("td")
		totalRow.appendChild(absentTotalTd)
		absentTotalTd.classList.add("votesTotalData")

		setVotes("j", yesVotesTd, yesTotalTd, data)
		setVotes("n", noVotesTd, noTotalTd, data)
		setVotes("a", abstainVotesTd, abstainTotalTd, data)
		setVotes("f", absentVotesTd, absentTotalTd, data)
	}
});

function setVotes(vote, td, totalTd, data) {
	var partyVotes = []

	for (const party in data.parti_roster[vote]) {
		partyVotes.push({"party": party, "votes": data.parti_roster[vote][party]})
	}
	
	partyVotes = partyVotes.sort(function (a, b) {
		if (a.votes > b.votes) return -1
		if (a.votes < b.votes) return 1
		return 0
	})

	for (const i in partyVotes) {
		const party = partyVotes[i]
		
		for (var v = 0; v < data.parti_roster[vote][party.party]; v++) {
			const box = document.createElement("div")
			td.appendChild(box)
			box.classList.add("voteBox")
			box.style.backgroundColor = getColor(party.party)
			totalTd.innerText = totalTd.innerText == "" ? 1 : parseInt(totalTd.innerText) + 1
		}
	}

	if (totalTd.innerText == "") {
		totalTd.innerText = 0
	}
}

function getColor(party) {
	if (party == "SD") {
		return "#fffc00";
	} else if (party == "V") {
		return "#990000";
	} else if (party == "S") {
		return "#ff0000";
	} else if (party == "KD") {
		return "#001973";
	} else if (party == "MP") {
		return "#009304";
	} else if (party == "L") {
		return "#00e0ff";
	} else if (party == "M") {
		return "#0030ff";
	} else if (party == "C") {
		return "#00ff21";
	} else if (party == "-") {
		return "#454545";
	}
}