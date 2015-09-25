var currentQuestion = 0;

var quiz = { 
	"title": "Physics Quiz",
	"description": ".....",
	"meta_tags": [
		"sceince","physics", "fun"
	],
	"difficulty": 1-20,
	"questions": [
		{
			"text": "What is the secret number?",
			"answers": ["0", "42", "17"],
			"correct_answer": 1,
			"meta_tags": ["geeky humor"]
		},
		{
			"text": "Question 2?",
			"answers": ["0", "42", "17"],
			"correct_answer": 1,
			"meta_tags": ["geeky humor"]
		}
	]
}

function nextQuestion() {
	if currentQuestion<quiz["questions"].length {
		currentQuestion+=1;
	}
	console.log(currentQuestion);
	document.getElementById("question").innerHTML = quiz["questions"][currentQuestion];
}