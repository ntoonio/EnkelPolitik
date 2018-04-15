var question = 0;
var quizJSON;
var support = [];

startQuiz();

//Grab quiz
function startQuiz() {
	$.getJSON("/getQuiz", function(data) {
		quizJSON = data;
		generateQuestion(quizJSON.quiz[0]);
	}).fail(function(a, b, c) {
		console.log(a);
		console.log(b);
		console.log(c);
	})
}

function selectOption(value) {
	support.push(value);
	if (!(quizJSON.quiz.length == question)) {
		//console.log('1');
		$.getJSON("/getQuiz", function(data) {
			console.log(JSON.stringify(data.quiz[1]));
			quizJSON = data;
			generateQuestion(quizJSON.quiz[question]);
		}).fail(function(a, b, c) {
			console.log(a);
			console.log(b);
			console.log(c);
		})

	} else {
		console.log('2');
		var arrStr = encodeURIComponent(JSON.stringify(support));
		$.getJSON("/submitQuiz?support=" + arrStr, function(data) {
			document.getElementById('quizcontainer').innerHTML = "<br /><br /><br /><br /><h3>The recomended party for you is " + data.firstParty + "!</h3>";
		});
	}
}

function generateQuestion(genJSON) {
	console.log("Generating" + JSON.stringify(genJSON));
	document.getElementById('quizcontainer').innerHTML = "<br /><br /><h3>Do you support: " + genJSON["law"] + "</h3>" +
		"<h4>" + genJSON.description + "</h4><br />" +
		"<button class=\"optionbutton\" style=\"background-color:#008705;\" onClick=\"selectOption(2)\">Yes, Very</button><br /><br />" +
		"<button class=\"optionbutton\" style=\"background-color:#00d128;\" onClick=\"selectOption(1)\">Yes</button><br /><br />" +
		"<button class=\"optionbutton\" style=\"background-color:#adadad;\" onClick=\"selectOption(0)\">I dont care</button><br /><br />" +
		"<button class=\"optionbutton\" style=\"background-color:#ff0000;\" onClick=\"selectOption(-1)\">No</button><br /><br />" +
		"<button class=\"optionbutton\" style=\"background-color:#9c0000;\" onClick=\"selectOption(-2)\">No, Very</button><br /><br />";
	question++;
}