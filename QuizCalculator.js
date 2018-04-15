function calc(parties, members, memberVotesYes,opiniom, importance) {
	

	var sumOfYes = memberVotesYes
	var sumOfNo = (members-memberVotesYes)


	for (var i = 1; i <= parties.length - 1; i++) {
		const p = members[i] / (sum - sumOfNo)
		parties[i] = opinion * p * importance
	}

	return parties
}



