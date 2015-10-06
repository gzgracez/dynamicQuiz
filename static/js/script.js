var name = "Name";
var currentQuestion = -1;
var quizLength = 0;
var userAnswers = [];

// Initial setup
$(document).ready(function() {
  // quizLength = Math.ceil(Math.random()*(quiz["questions"].length-(quiz["questions"].length/2)))+(quiz["questions"].length/2)
  quizLength = Math.ceil(Math.random()*(quiz["questions"].length-(quiz["questions"].length/2))+(quiz["questions"].length/2));
  $('#title').text(quiz["title"]);
  $('#title').text("Grace's Chemistry Quiz");
  $('#answerChoices').hide();
  $('#nextQuestion').hide();
  $('#nameFormWarning').hide();
  $('#nameForm').submit(function (e) {
    e.preventDefault();
    nameForm();
  });
  document.getElementById("nextQuestion").addEventListener("click", nextQuestion);
});

// After name is submitted on initial screen
function nameForm(){
  name = $('#nameForm').serializeArray()[0]["value"];
  if (name.length === 0) {
    $('#nameFormWarning').show();
  }
  else {
    $('#nameFormWarning').hide();
    $('#nameForm').hide();
    $('#nextQuestion').show();
    $('#answerChoices').show();
    $('#welcome').text("Welcome " + name + "!");
    nextQuestion();
  }
}

// Go to next question in quiz
function nextQuestion() {
  // Questions in quiz
  if (currentQuestion<quizLength-1) {
    if (currentQuestion > -1) {
      // ***add whether user is correct, what answer was chosen
      userAnswers.push([currentQuestion]);
      if (!$("input[name='answers']").is(':checked')){
        console.log("NOTHING CHECKED");
      }
      else {
        console.log("SOMETHING CHECKED");
      }
    }
    currentQuestion+=1;
    console.log(quizLength);
    $('#questionNumber').text("Question " + (currentQuestion+1));
    $('#question').text(quiz["questions"][currentQuestion]["text"]);
    var numAns = 2 + Math.ceil((Math.random()*3));
    console.log(numAns);
    // uncheck answers
    $('input[name="answers"]').prop('checked',false);
    for (var i = 0; i<numAns; i++) {
      $('#' + i).show();
      // answer choices radio button labels
      var aID = "label[for=" + i + "]";
      $(aID).show();
      $(aID).html(quiz["questions"][currentQuestion]["answers"][i]);
    }
    // hide excess answer choices
    for (var a = numAns; a<5; a++) {
      $('#' + a).hide();
      var labelID = "label[for=" + a + "]";
      $(labelID).hide();
    }
  }

  // End of quiz
  else {
    $('#welcome').hide();
    $('#questionNumber').hide();
    $('#question').hide();
    $('#nextQuestion').hide();
    $('#answerChoices').hide();
    $('#score').show();
    $('#nameScore').text(name + ", your score on this quiz is:");
  }
}