var currentQuestion = 0;

document.getElementById("nextQuestion").addEventListener("click", nextQuestion);
// document.getElementById("nameForm").addEventListener("submit", test);

function nextQuestion() {
	while (currentQuestion<quiz["questions"].length) {
		currentQuestion+=1;
	}
	console.log(currentQuestion);
	document.getElementById("question").innerHTML = quiz["questions"][currentQuestion]["text"];
}

function test(){
	console.log(document.getElementById("firstname").value);
	var name = document.getElementById("firstname").value;


	document.getElementById("question").innerHTML = name;
}