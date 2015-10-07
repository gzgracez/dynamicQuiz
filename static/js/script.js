// Make separate method for checking which answer is selected

var name = "Name";
var currentQuestion = -1;
var quizLength = 0;
var numAns = 0;
var userAnswers = [];
var score = 0;

// Initial setup
$(document).ready(function() {
  // quizLength = Math.ceil(Math.random()*(quiz["questions"].length-(quiz["questions"].length/2)))+(quiz["questions"].length/2)
  quizLength = Math.ceil(Math.random()*(quiz["questions"].length-(quiz["questions"].length/2))+(quiz["questions"].length/2));
  $('#title').text(quiz["title"]);
  $('#title').text("Chemistry Quiz");
  $('#answerChoices').hide();
  $('#previousQuestion').hide();
  $('#nextQuestion').hide();
  $('#answerWarning').hide();
  $('#nameFormWarning').hide();
  $('[data-hide]').on("click", function(){
    $('#nameFormWarning').hide();
    $('#answerWarning').hide();
  });
  $('#nameForm').submit(function (e) {
    e.preventDefault();
    nameForm();
  });
  $('#piechart').hide();
  document.getElementById("previousQuestion").addEventListener("click", back);
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

// Show questions and answers of random length
function generateQARandom (){
  console.log(quizLength);
  $('#questionNumber').text("Question " + (currentQuestion+1));
  $('#question').text(quiz["questions"][currentQuestion]["text"]);
  numAns = 2 + Math.ceil((Math.random()*3));
  console.log(numAns);
  // uncheck answers
  $('input[name="answers"]').prop('checked',false);
  for (var i = 0; i < numAns; i++) {
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
  if (currentQuestion === 0) {
    $('#previousQuestion').hide();
  }
  else {
    $('#previousQuestion').show();
  }
}

// Show questions and answers
function generateQA (){
  console.log(quizLength);
  $('#questionNumber').text("Question " + (currentQuestion+1));
  $('#question').text(quiz["questions"][currentQuestion]["text"]);
  numAns = quiz["questions"][currentQuestion]["answers"].length;
  // uncheck answers
  $('input[name="answers"]').prop('checked',false);
  for (var i = 0; i < numAns; i++) {
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
  if (currentQuestion === 0) {
    $('#previousQuestion').hide();
  }
  else {
    $('#previousQuestion').show();
  }
}

function back(){
  if (currentQuestion <= 0) {
    $('#previousQuestion').hide();
  }
  else {
    currentQuestion--;
    if (currentQuestion <= 0) {
      $('#previousQuestion').hide();
    }
    generateQA();
    var pCheckedAnswer = userAnswers[currentQuestion][2];
    $('input[name="answers"][id="' + pCheckedAnswer + '"').prop('checked',true);
  }
}

// Check which radio button is checked and record
function whichChecked() {
  for (var i = 0; i < numAns; i++) {
    if ($("input[name='answers'][id='" + i + "']").is(':checked')) {
      console.log ("This number is checked " + i + " " + quiz["questions"][currentQuestion]["correct_answer"]);
      if (i === quiz["questions"][currentQuestion]["correct_answer"])
        userAnswers.push([currentQuestion, true, i]);
      else
        userAnswers.push([currentQuestion, false, i]);
    }
  }
}

// Calculate Score
function calculateScore() {
  for (var i = 0; i < quizLength; i++){
    if (userAnswers[i][1]) {
      score++;
    }
  }
}

// Display correct/incorrect for each question
function scorePerQuestion() {
  for (var r = 0; r < quizLength; r++) {
    var qResult = document.createElement("p");
    var qNode;
    if (userAnswers[r][1])
      qNode = document.createTextNode("Question " + (r + 1) + ": " + "Correct");
    else
      qNode = document.createTextNode("Question " + (r + 1) + ": " + "Incorrect");
    qResult.appendChild(qNode);
    var dElement = document.getElementById("score");
    dElement.appendChild(qResult);
  }
}

// Create pie chart for score
function createPieChart(wrong,right,percentW,percentR) {
  var red = "#FF0000 ";
  var green = "#006600";

  var chart = document.getElementById('piechart');
  var ctx = chart.getContext('2d');
  ctx.clearRect(0, 0, chart.width, chart.height);

  var cx = 150;
  var cy = 150;
  var radius = 100;

  var wrongFraction = Math.PI * 2.0 * (wrong/(right+wrong));
  var rightFraction = Math.PI * 2.0 * (right/(right+wrong));
  console.log(wrongFraction);
  console.log(rightFraction);

  // incorrect
  ctx.fillStyle = red;
  // ctx.strokeStyle = "#000000";
  ctx.strokeStyle = red;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, wrongFraction, true);
  ctx.lineTo(cx,cy);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  // var wTextX = Math.cos(wrongFraction/2) * 100 + cx;
  // var wTextY = Math.sin(wrongFraction/2) * 100 + cy;
  // ctx.fillStyle = "#ffffff";
  // ctx.font = '14px Calibri';
  // ctx.fillText("Incorrect: " + percentW,wTextX,wTextY);

  // correct
  ctx.fillStyle = green;
  // ctx.strokeStyle = "#000000";
  ctx.strokeStyle = green;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, wrongFraction, Math.PI * 2, true);
  ctx.lineTo(cx,cy);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  // var rTextX = Math.cos(wrongFraction + (rightFraction/2)) * 100 + cx;
  // var rTextY = Math.sin(wrongFraction + (rightFraction/2)) * 100 + cy;
  // ctx.fillStyle = "#ffffff";
  // ctx.font = '14px Calibri';
  // ctx.fillText("Correct: " + percentR,rTextX,rTextY);
}

// Go to next question in quiz
function nextQuestion() {
  console.log ("CURRENT QUESTION" +currentQuestion);
  // Before end of quiz
  if (currentQuestion<quizLength-1) {
    // if one of the quiz questions
    if (currentQuestion > -1) {
      // if no answer is checked
      if (!$("input[name='answers']").is(':checked')){
        $('#answerWarning').show();
        if (currentQuestion === 0) {
          $('#previousQuestion').hide();
        }
        else {
          $('#previousQuestion').show();
        }
      }
      // if an answer is checked
      else {
        $('#answerWarning').hide();
        if (currentQuestion === 0) {
          $('#previousQuestion').hide();
        }
        else {
          $('#previousQuestion').show();
        }
        whichChecked();
        currentQuestion+=1;
        generateQA();
      }
    }
    // if before first question of quiz
    else {
      $('#previousQuestion').hide();
      currentQuestion+=1;
      generateQA();
    }
  }

  // End of quiz
  else {
    // Check last question of quiz
    // if answer is not checked
    if (!$("input[name='answers']").is(':checked')){
      $('#answerWarning').show();
    }
    // if an answer is checked
    else {
      $('#answerWarning').hide();
      whichChecked();// Display end of quiz screen
      $('#welcome').hide();
      $('#questionNumber').hide();
      $('#question').hide();
      $('#previousQuestion').hide();
      $('#nextQuestion').hide();
      $('#answerChoices').hide();
      $('#score').show();
      $('#piechart').show();
      calculateScore();
      $('#nameScore').text(name + ", your score on this quiz is: " + score + "/" + quizLength);
      scorePerQuestion();
      createPieChart(quizLength-score, score, ((quizLength-score)*100)/quizLength, 100*score/quizLength);
    }
  }
}