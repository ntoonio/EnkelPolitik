var question=0;
var quizJSON;
var support=[];


startQuiz();

//Grab quiz
function startQuiz() {
  $.getJSON("/getQuiz", function(data) {
    console.log("test");
    quizJSON = data;
    generateQuestion(quizJSON.quiz[0]);
  }).fail(function(a,b,c) {
    console.log(a);
    console.log(b);
    console.log(c);
  })
  console.log("test2");
}

function selectOption(value) {
  support.push(value);
  if(!(quizJSON.quiz.length==question)) {
    //console.log('1');
    $.getJSON("/getQuiz", function(data) {
      console.log(JSON.stringify(data.quiz[1]));
      quizJSON = data;
      generateQuestion(quizJSON.quiz[question]);
    }).fail(function(a,b,c) {
      console.log(a);
      console.log(b);
      console.log(c);
    })

  //  generateQuestion(quizJSON.quiz[question]);
  } else {
    console.log('2');
    var arrStr = encodeURIComponent(JSON.stringify(support));
    $.getJSON("/submitQuiz?support="+arrStr, function(data) {
      document.getElementById('quizcontainer').innerHTML = "<h3>The recomended party for you is " + data.firstParty + "!</h3>";
    });
  }
}

function generateQuestion(genJSON) {
  console.log("Generating" + JSON.stringify(genJSON));
  document.getElementById('quizcontainer').innerHTML = "<h2>Do you support: " + genJSON["law"] + "</h2>"
  + "<h3>" + genJSON.description + "</h3>" +
  "<button style=\"background-color:#008705;\" onClick=\"selectOption(2)\">Yes, Very</button><br />"+
  "<button style=\"background-color:#00d128;\" onClick=\"selectOption(1)\">Yes</button><br />"+
  "<button style=\"background-color:#adadad;\" onClick=\"selectOption(0)\">I dont care</button><br />"+
  "<button style=\"background-color:#ff0000;\" onClick=\"selectOption(-1)\">No</button><br />"+
  "<button style=\"background-color:#9c0000;\" onClick=\"selectOption(-2)\">No, Very</button><br />";
  question++;
}
