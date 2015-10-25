// Make separate method for checking which answer is selected
var quiz;
var name = "Name";
var currentQuestion = -1;
var quizLength = 0;
var numAns = 0;
var userAnswers = [];
var userJSON;
var score = 0;

// Initial setup
$(document).ready(function() {
  // quizLength = Math.ceil(Math.random()*(quiz["questions"].length-(quiz["questions"].length/2))+(quiz["questions"].length/2));
  // quizLength = quiz["questions"].length;
  // $('#title').text(quiz["title"]);
  $('#title').text("Dynamic Quiz");
  $('#title').hide().fadeIn("slow");
  $('#nameForm').hide().fadeIn("slow");
  $('#answerChoices').hide();
  $('#previousQuestion').hide();
  $('#nextQuestion').hide();
  $('#answerWarning').hide();
  $('#nameFormWarning').hide();
  $('#scoreTable').hide();
  $('#home').hide();
  $('#ajaxloading').hide();
  $('#backHome').hide();
  $('#reload').hide();
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
  $("#answerChoices").keyup(function(event){
    if(event.keyCode == 13){
      $("#nextQuestion").click();
    }
  });
});

// After name is submitted on initial screen
function nameForm(){
  name = $('#nameForm').serializeArray()[0]["value"];
  if (name.length === 0) {
    $('#nameFormWarning').fadeIn();
  }
  else {
    $('#nameFormWarning').hide();
    $('#nameForm').hide();
    $('#welcome').text("Welcome " + name + "!");
    loadQuiz();
  }
}

// load quiz.json
function loadQuiz(){
  $.getJSON('static/quiz.json')
  .done(function (data) {
    $('#ajaxloading').hide();
    $('#backHome').hide();
    $('#reload').hide();
    quiz = data;
    if (quiz["questions"] === undefined) {
      $('#ajaxloading').text("Sorry, we cannot load the quiz. Please reload the page to try again.");
      $('#ajaxloading').show();
      $('#reload').show();
      $('#backHome').show();
    }
    else {
      quizLength = quiz["questions"].length;
      $('#nextQuestion').show();
      $('#answerChoices').show();
      nextQuestion();
      console.log(data);
    }
  })
  .fail(function() {
    $('#ajaxloading').text("Sorry, we cannot load the quiz. Please reload the page to try again.");
    $('#ajaxloading').show();
    $('#reload').show();
    $('#backHome').show();
  })
  .always(function() {
    $('#reload').on('click', function(e){
      e.preventDefault();
      loadQuiz();
    });
  });
}

function loadUsers(){
  $.getJSON('static/users.json')
  .done(function (data) {
    console.log(data);
    userJSON = data;
  })
  .fail(function() {
    console.log("Failed to load user JSON");
  });
  console.log(userJSON);
}

// Show questions and answers
function generateQA (){
  console.log(quizLength);
  $('#questionNumber').text("Question " + (currentQuestion+1)).hide().fadeIn();
  $('#question').text(quiz["questions"][currentQuestion]["text"]).hide().fadeIn();
  numAns = quiz["questions"][currentQuestion]["answers"].length;
  // if answered already
  if (currentQuestion < userAnswers.length) {
    $('input[name="answers"][id="' + userAnswers[currentQuestion][2] + '"]').prop('checked',true);
    for (var i = 0; i < numAns; i++) {
      $('#b' + i).show();
      $('#' + i).fadeIn();
      // answer choices radio button labels
      var aID = "label[for=" + i + "]";
      $(aID).fadeIn();
      $(aID).html(quiz["questions"][currentQuestion]["answers"][i]).hide().fadeIn();
    }
    // hide excess answer choices
    for (var a = numAns; a<7; a++) {
      $('#b' + a).fadeOut();
      $('#' + a).fadeOut();
      var labelID = "label[for=" + a + "]";
      $(labelID).fadeOut();
    }

  }
  // if hasn't been answered before
  else {
    // uncheck answers
    $('input[name="answers"]').prop('checked',false);
    for (var i = 0; i < numAns; i++) {
      $('#b' + i).show();
      $('#' + i).fadeIn();
      // answer choices radio button labels
      var aID = "label[for=" + i + "]";
      $(aID).fadeIn();
      $(aID).html(quiz["questions"][currentQuestion]["answers"][i]).hide().fadeIn();
    }
    // hide excess answer choices
    for (var a = numAns; a<7; a++) {
      $('#b' + a).fadeOut();
      $('#' + a).fadeOut();
      var labelID = "label[for=" + a + "]";
      $(labelID).fadeOut();
    }

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
      console.log ("The answer chosen is " + i + " " + quiz["questions"][currentQuestion]["correct_answer"]);
      // if already added to userAnswers
      if (currentQuestion < userAnswers.length) {
        if (i === quiz["questions"][currentQuestion]["correct_answer"]) {
          userAnswers[currentQuestion][1] = true;
          userAnswers[currentQuestion][2] = i;
        }
        else {
          userAnswers[currentQuestion][1] = false;
          userAnswers[currentQuestion][2] = i;
        }
      }
      // if new answer
      else {
        if (i === quiz["questions"][currentQuestion]["correct_answer"])
          userAnswers.push([currentQuestion, true, i]);
        else
          userAnswers.push([currentQuestion, false, i]);
      }
    }
  }
}

// Calculate Score
function calculateScore() {
  loadUsers();
  var currentUser;
  if (userJSON === undefined) {
    console.log ("userJSON failed to load");
    for (var i = 0; i < quizLength; i++){
      if (userAnswers[i][1]) {
        quiz["questions"][i]["global_correct"]+=1;
        score++;
      }
      quiz["questions"][i]["global_total"]+=1;
    }
    console.log(score);
    console.log(userJSON);
  }
  // else {
  //   console.log(userJSON);
  //   currentUser = userJSON.length;
  //   for (var i = 0; i < userJSON.length; i++) {
  //     if (userJSON[i].name === name) {
  //       currentUser = i;
  //       break;
  //     }
  //   }
  //   // if new user
  //   if (currentUser === userJSON.length) {
  //     userJSON[currentUser]["name"] = name;
  //     userJSON[currentUser]["questions"] = [];
  //     userJSON[currentUser]["user_total"] = 0;
  //     userJSON[currentUser]["user_correct"] = 0;
  //   }
  //   for (var i = 0; i < quizLength; i++){
  //     if (userAnswers[i][1]) {
  //       quiz["questions"][i]["global_correct"]+=1;
  //       userJSON[currentUser]["questions"][i]+=1;
  //       userJSON[currentUser]["user_correct"]+=1;
  //       score++;
  //     }
  //     quiz["questions"][i]["global_total"]+=1;
  //     userJSON[currentUser]["user_total"]+=1;
  //   }
  //   console.log(score);
  //   console.log(userJSON);
  // }
}

// Display score table
function scorePerQuestionTable() {
  for (var r = 0; r < quizLength; r++) {
    $('#scoreTable').fadeIn("slow");
    var scorePercent = Math.round(100*quiz["questions"][r]["global_correct"]/quiz["questions"][r]["global_total"]);
    if (userAnswers[r][1])
      $('#scoreTable > tbody:last-child').append('<tr class="success"><td class="questionNum">' + (r + 1) + '. ' + quiz["questions"][r]["text"] +
        '</td><td>' + quiz["questions"][r]["answers"][userAnswers[r][2]] +
        '<td>' + quiz["questions"][r]["answers"][quiz["questions"][r]["correct_answer"]] +
        '</td><td>' + scorePercent + "%" +
        '</tr>');
    else
      $('#scoreTable > tbody:last-child').append('<tr class="danger"><td class="questionNum">' + (r + 1) + '. ' + quiz["questions"][r]["text"] +
        '</td><td>' + quiz["questions"][r]["answers"][userAnswers[r][2]] +
        '<td>' + quiz["questions"][r]["answers"][quiz["questions"][r]["correct_answer"]] +
        '</td><td>' + scorePercent + "%" +
        '</tr>');
  }
}

// Create pie chart for score
function createPieChart(wrong,right,percentW,percentR) {
  var red = "#FF0000 ";
  var green = "#006600";

  var chart = document.getElementById('piechart');
  var ctx = chart.getContext('2d');
  ctx.clearRect(0, 0, chart.width, chart.height);

  var cx = chart.width/2;
  var cy = chart.height/2;
  var radius = 100;

  var wrongFraction = Math.PI * 2.0 * (wrong/(right+wrong));
  var rightFraction = Math.PI * 2.0 * (right/(right+wrong));
  console.log(wrong + "  " + wrongFraction);
  console.log(right + " "  + rightFraction);

  // incorrect
  ctx.fillStyle = red;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, wrongFraction, false);
  ctx.lineTo(cx,cy);
  ctx.closePath();
  ctx.fill();

  // correct
  ctx.fillStyle = green;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, wrongFraction, Math.PI * 2, false);
  ctx.lineTo(cx,cy);
  ctx.closePath();
  ctx.fill();

  // legend
  ctx.font = "14px Calibri";

  ctx.fillStyle = green;
  ctx.fillRect(cx + radius + 50,cy - 20,20,15);
  ctx.fillText("Correct",cx + radius + 80,cy - 10);

  ctx.fillStyle = red;
  ctx.fillRect(cx + radius + 50,cy + 20,20,15);
  ctx.fillText("Incorrect",cx + radius + 80,cy + 30);
}

// Add instagram picture
function instagram(){
  // need api key
}

// Keep track of users + their scores
function userScores(){
  $.ajax({
    type:"POST",
    url: "static/users.json",
    data: JSON.stringify(userJSON),
    timeout: 2000,
    contentType: "application/json; charset=utf-8",
    beforeSend: function(){
      console.log ("BEFORE USER SEND");
    },
    complete: function() {
      console.log ("COMPLETE USER LOADING");
    },
    success: function(data){
      console.log(data);
    },
    fail: function(){
      console.log("USER FAILED");
    }
  });
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
        $('#answerWarning').fadeIn();
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
      $('#piechart').fadeIn("slow");
      $('#home').show();
      calculateScore();
      $('#nameScore').text(name + ", your score on this quiz is: " + score + "/" + quizLength + " questions or " + Math.round(100*score/quizLength) + "%");
      scorePerQuestionTable();
      console.log(score);
      console.log(JSON.stringify(quiz));
      // Global Scores
      $.ajax({
        type:"POST",
        url: "static/quiz.json",
        data: JSON.stringify(quiz),
        timeout: 2000,
        contentType: "application/json; charset=utf-8",
        beforeSend: function(){
          console.log ("BEFORE SEND");
        },
        complete: function() {
          console.log ("COMPLETE LOADING");
        },
        success: function(data){
          console.log(data);
        },
        fail: function(){
          console.log("FAILED");
        }
      });
      
      createPieChart(quizLength-score, score, ((quizLength-score)*100)/quizLength, 100*score/quizLength);
    }
  }
}