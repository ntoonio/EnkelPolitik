var RESPONSE=prompt("what is your opinion on this draft?")
var IMP=prompt("how important do you consider this draft?")
calculate(4,12, RESPONSE, IMP,3,9)

function calculate(party,P_VOTES, U_VOTES, Q_IMP ,P_YES,P_NO) {
	var result=0
	var parties;
	if(P_VOTES*U_VOTES>0) {
    parties.push(party+" "+P_VOTES*U_VOTES*Q_IMP+(P_YES-P_NO)) 
}
	if(P_VOTES*U_VOTES<0) {
    parties.push(party+" "+P_VOTES*U_VOTES*Q_IMP-(P_YES-P_NO)) 
}
		

}
