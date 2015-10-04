var currentQuestion = -1;

$(document).ready(function() {
  $('#answerChoices').hide();
  $('#nextQuestion').hide();
  $('#nameForm').submit(function (e) {
    e.preventDefault();
    nameForm();
  });
  document.getElementById("nextQuestion").addEventListener("click", nextQuestion);
});

function nameForm(){
  var nameArray = $('#nameForm').serializeArray();
  var name = nameArray[0]["value"];
  $('#nameForm').hide();
  $('#nextQuestion').show();
  $('#welcome').text("Welcome " + name + "!");
  nextQuestion();
}

function nextQuestion() {
	if (currentQuestion<quiz["questions"].length-1) {
		currentQuestion+=1;
	}
	console.log(currentQuestion);
  $('#questionNumber').text("Question " + (currentQuestion+1));
	$('#question').text(quiz["questions"][currentQuestion]["text"]);
}