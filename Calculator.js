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

var parties = 		[]
var memebers = 		[]
var memberVotes = 	[]

console.log(calc(parties, members, memberVotes))