var question;
var quizJSON;
var support;


startQuiz();

//Grab quiz
function startQuiz() {
  $.getJSON("/getQuiz", function(data) {
    quizJSON = data;
    generateQuestion(quizJSON.quiz[0]);
  });
}

function selectOption(value) {
  support.push(value);
  if(!(quizJSON.quiz.length-1==question)) {
    question++;
    generateQuestion(quizJSON.quiz[question]);
  } else {
    var arrStr = encodeURIComponent(JSON.stringify(support));
    $.getJSON("/submitQuiz?support="+arrStr, function(data) {
      document.getElementById('quizcontainer').innerHTML = "<h3>The recomended party for you is " + data.firstParty + "!</h3>";
    });
  }
}

function generateQuestion(genJSON) {
  document.getElementById('quizcontainer').innerHTML = "<h2>Do you support: " + genJSON.law + "</h2>"
  + "<h3>" + genJSON.description + "</h3>" +
  "<button style=\"background-color:#008705;\" onClick=\"selectOption(2)\">Yes, Very</button>"+
  "<button style=\"background-color:#00d128;\" onClick=\"selectOption(1)\">Yes</button>"+
  "<button style=\"background-color:#adadad;\" onClick=\"selectOption(0)\">I dont care</button>"+
  "<button style=\"background-color:#ff0000;\" onClick=\"selectOption(-1)\">No</button>"+
  "<button style=\"background-color:#9c0000;\" onClick=\"selectOption(-2)\">No, Very</button>";
}
