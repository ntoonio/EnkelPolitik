function calc(opinion, importance, parties, members, memberVotes) {
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
				sumOfNo++
			}
		}
	}

	for (var i = 1; i <= parties.length - 1; i++) {
		const p = members[i] / (sum - sumOfNo)
		parties[i] = opinion * p * importance
	}

	return parties
}

var parties = [0,0,0,0,0,0,0,0,0]
var memebers = [0,0,0,0,0,0,0,0,0,0,0,0]
var memberVotes = [0,0,0,0,0,0,0,0,0,0,0,0,0]

const o = parseFloat(prompt("what is your opinion on this draft"))
const i = parseFloat(prompt("how impotant do you consider this draft to be"))

console.log(calc(o, i, parties, members, memberVotes))