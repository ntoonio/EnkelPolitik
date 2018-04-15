function calculate(party ,pVotes, uVotes, qImp, pYes, pNo) {
	var result = 0
	var parties = [];

	if (pVotes * uVotes > 0) {
		parties.push(party + " " + pVotes * uVotes * qImp + (pYes - pNo)) 
	}
	if (pVotes * uVotes < 0) {
		parties.push(party + " " + pVotes * uVotes * qImp - (pYes - pNo)) 
	}
}
