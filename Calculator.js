function Calc() {
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



}