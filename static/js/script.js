var currentQuestion = -1;

$(document).ready(function() {
  $('#nameform').submit(function (e) {
    e.preventDefault();
    nameForm();
  });
  document.getElementById("nextQuestion").addEventListener("click", nextQuestion);
})

function nameForm(){
  var nameArray = $('#nameform').serializeArray();
  var name = nameArray[0]["value"];
  $('#nameform').hide();
  $('#welcome').text("Welcome " + name + "!");
  nextQuestion();
  console.log(name);
}

function nextQuestion() {
	if (currentQuestion<quiz["questions"].length-1) {
		currentQuestion+=1;
	}
	console.log(currentQuestion);
  $('#questionNumber').text("Question " + (currentQuestion+1));
	$('#question').text(quiz["questions"][currentQuestion]["text"]);
}

function test(){
	console.log(document.getElementById("firstname").value);
	var name = document.getElementById("firstname").value;


	document.getElementById("question").innerHTML = name;
}