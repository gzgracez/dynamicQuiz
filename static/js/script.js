/*
* Option to reset to the default set of quizzes
* Top ten users
  * Keeps track of users (by username) who have taken the quiz multiple times (averages user's score)
* Dismiss-able notifications/alerts
* Forms and multiple choice answers can be submitted with the ```enter``` key
* Checks that all text inputs and radio buttons have been entered/selected before submission of create and edit quiz
*/

var quiz;
var name = "Name";
var currentQuestion = -1;
var quizLength = 0;
var numAns = 0;
var userAnswers = [];
var userJSON;
var score = 0;
var titles;
var selectedQuiz = 0;
var ids;
var notificationFadeTime = 3000;

// Initial setup
$(document).ready(function() {
  $.getJSON('titlesandids')
  .done(function (data) {
    // console.log(data);
    titles = data.slice(0,data.length/2);
    ids = data.slice(data.length/2);
    if (titles === undefined) {
      $('#ajaxloading').text("Sorry, we cannot load the quizzes. Please reload the page to try again.");
      $('#ajaxloading').show();
      $('#reload').show();
    }
  })
  .fail(function() {
    $('#ajaxloading').text("Sorry, we cannot load the quizzes. Please reload the page to try again.");
    $('#ajaxloading').show();
    $('#reload').show();
  });
  $('#title').text("Dynamic Quiz");
  $('#title').hide().fadeIn("slow");
  $('#nameForm').hide().fadeIn("slow");
  $('#description').hide();
  $('#answerChoices').hide();
  $('#previousQuestion').hide();
  $('#nextQuestion').hide();
  $('#answerWarning').hide();
  $('#nameFormWarning').hide();
  $('#scoreTable').hide();
  $('#userTable').hide();
  $('#tenScores').hide();
  $('#home').hide();
  $('#ajaxloading').hide();
  $('#backHome').hide();
  $('#quizSuccess').hide();
  $('#quizWarning').hide();
  $('#placeholderWarning').hide();
  $('#placeholderSuccess').hide();
  $('#reload').hide();
  $('#editQuiz').hide();
  $('#piechart').hide();
  $('[data-hide]').on("click", function() {
    $('#nameFormWarning').hide();
    $('#answerWarning').hide();
    $('#quizSuccess').hide();
    $('#quizWarning').hide();
    $('#placeholderWarning').hide();
    $('#placeholderSuccess').hide();
  });

  //start quiz
  document.getElementById("start_quiz").addEventListener("click", function(e) {
    // console.log("start");
    $('#editQuiz').hide();
    e.preventDefault();
    nameForm();
  });

  //create quiz
  document.getElementById("create_quiz").addEventListener("click", function(e) {
    // console.log("create");
    if ($("#createquizsubmit").length) {
      if ($('#editQuiz').is(":hidden")) {
        loadQuizToCreate();
      } 
      else {
        $('#editQuiz').hide();
      }
    }
    else {
      loadQuizToCreate();
    }
    e.preventDefault();
  });

  //update quiz
  document.getElementById("update_quiz").addEventListener("click", function(e) {
    // console.log("update");
    // console.log($('#titlesDropdown option:selected').text());
    // console.log(titles.indexOf($('#titlesDropdown option:selected').text()));
    selectedQuiz = ids[titles.indexOf($('#titlesDropdown option:selected').text())];
    // if there exists a quiz
    if (selectedQuiz > -1) {
      if ($("#createquizsubmit").length) {
        loadQuizToEdit(selectedQuiz);
      }
      else {
        if ($('#editQuiz').is(":hidden")) {
          loadQuizToEdit(selectedQuiz);
        } 
        else {
          $('#editQuiz').hide();
        }
      }
    } 
    else {
      $('#quizSuccess').hide();
      $('#quizWarning').show();
      $("#quizWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
        $("#quizWarning").hide();
      });
    }
    e.preventDefault();
  });

  //delete quiz
  document.getElementById("delete_quiz").addEventListener("click", function(e) {
    selectedQuiz = ids[titles.indexOf($('#titlesDropdown option:selected').text())];
    // if there exists a quiz
    if (selectedQuiz > -1) {
      $.ajax({
        type: "DELETE",
        url: "quiz/" + selectedQuiz,
        timeout: 2000,
        contentType: "application/json; charset=utf-8",
        beforeSend: function() {
          $("delete_quiz").attr("disabled", true);
          $('#editQuiz').hide();
          // console.log ("BEFORE DELETE SEND");
        },
        complete: function() {
          // console.log ("COMPLETE DELETE LOADING");
        },
        success: function(data) {
          // console.log("DELETE sent");
          $("delete_quiz").attr("disabled", false);
          $('#quizSuccess').show();
          $("#quizSuccess").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
            $("#quizSuccess").hide();
          });
          loadTitles();
        },
        fail: function() {
          // console.log("DELETE FAILED");
        }
      });
    }
    // if no quiz
    else {
      // console.log(selectedQuiz);
      $('#quizSuccess').hide();
      $('#quizWarning').show();
      $("#quizWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
        $("#quizWarning").hide();
      });
    }
    e.preventDefault();
  });

  document.getElementById("reset_quiz").addEventListener("click", function(e) {
    resetQuizzes();
    e.preventDefault();
  });

  document.getElementById("previousQuestion").addEventListener("click", back);
  document.getElementById("nextQuestion").addEventListener("click", nextQuestion);

  $("#answerChoices").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#nextQuestion").click();
    }
  });

    // edit quiz
    $(".editQuizFormDiv").delegate('.editQuizAddRemoveAns', 'click', function(e) {
      var tempID = this.id;
      var tempChunks = tempID.split('-');
      var tempQuestionNum = parseInt(tempChunks[1]);
      var tempAnswerNum = parseInt(tempChunks[2]);
      // add answer
      if (tempID.length < 21) {
        if ((tempAnswerNum + 1) < 7) {
          tempAnswerNum += 1;
          $('<input>').attr({
            type: 'radio',
            name: 'answersr' + tempQuestionNum,
            class: 'answersradioclass',
            id: 'answerradiobutton-' + tempQuestionNum + '-' + tempAnswerNum
          }).appendTo('#answer' + tempQuestionNum);
          $('<input>').attr({
            type: 'text',
            id: 'answer-' + tempQuestionNum + '-' + tempAnswerNum,
            class: 'form-control editanswers',
            name: 'answers',
            placeholder: 'Answer Choice'
          }).appendTo('#answer' + tempQuestionNum);
          $('<br>').attr({
            id: 'br-' + tempQuestionNum + '-' + tempAnswerNum
          }).appendTo('#answer' + tempQuestionNum);
          $(this).attr("id", "editQuizAddAns-" + tempQuestionNum + '-' + tempAnswerNum);
          $('#editQuizRemoveAns-' + tempQuestionNum + '-' + (tempAnswerNum - 1)).attr("id", "editQuizRemoveAns-" + tempQuestionNum + '-' + tempAnswerNum);
        }
        else {
          $('#placeholderWarning > p > span').text("Cannot add answer choice - reached maximum number of answers!");
          $('#placeholderWarning > p > span').append('&nbsp;');
          $('#placeholderWarning').show();
          $("#placeholderWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
            $("#placeholderWarning").hide();
          });
        }
      }
      // remove answer
      else {
        // console.log("remove");
        if ((tempAnswerNum - 1) > 0) {
          $('#answerradiobutton-' + tempQuestionNum + '-' + tempAnswerNum).remove();
          $('#answer-' + tempQuestionNum + '-' + tempAnswerNum).remove();
          $('#br-' + tempQuestionNum + '-' + tempAnswerNum).remove();
          tempAnswerNum -= 1;
          $(this).attr("id", "editQuizRemoveAns-" + tempQuestionNum + '-' + tempAnswerNum);
          $('#editQuizAddAns-' + tempQuestionNum + '-' + (tempAnswerNum + 1)).attr("id", "editQuizAddAns-" + tempQuestionNum + '-' + tempAnswerNum);
        } 
        else {
          $('#placeholderWarning > p > span').text("Cannot remove answer choice - reached minimum number of answers!");
          $('#placeholderWarning > p > span').append('&nbsp;');
          $('#placeholderWarning').show();
          $("#placeholderWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
            $("#placeholderWarning").hide();
          });
        }
      }
      e.preventDefault();
      return false;
    });

  $(".editQuizFormDiv").delegate('.removeQuestion', 'click', function(e) {
    if (($("#editQuiz > div").length) > 3) {
      var tempID = this.id;
      var tempChunks = tempID.split('-');
      var tempQuestion = tempChunks[1];
      $('#questiondiv' + tempQuestion).remove();
    } 
    else {
      $('#placeholderWarning > p > span').text("Cannot remove question - reached minimum number of questions!");
      $('#placeholderWarning > p > span').append('&nbsp;');
      $('#placeholderWarning').show();
      $("#placeholderWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
        $("#placeholderWarning").hide();
      });
    }
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  });

  $('#titlesDropdown').change(function() {
    $('#editQuiz').hide();
  });

  // submit edited quiz
  $("#editQuizForm").on('click', '#editquizsubmit', function(e) {
    e.preventDefault();
    var radioChecked = true;
    var textInput = true;
    $("#editQuiz > div").each(function() {
      var tempID = $(this).attr('id');
      var tempQuestionNum = parseInt(tempID.substring(11));
      if(!$("input:radio[name='answersr" + tempQuestionNum + "']").is(":checked")){
        radioChecked = false;
        return false;
      }
    });

    $(':text').not(document.getElementById("firstName")).each(function() {
      if(!($.trim($(this).val()).length > 0)) {
        $(this).css({ "border": '#FF0000 1px solid'});
        textInput = false;
      }
      else {
        $(this).css({ "border": '1px solid #ccc'});
      }
    });

    if (radioChecked && textInput) {
      submitEditedQuiz();
    }
    else {
      $('#placeholderWarning > p > span').text("Please select correct answers and fill out all text fields for each question!");
      $('#placeholderWarning > p > span').append('&nbsp;');
      $('#placeholderWarning').show();
      $("#placeholderWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
        $("#placeholderWarning").hide();
      });
    }
  });

  // add question
  $("#editQuizForm").on('click', '#addQuestion', function (e) {
    var tempID = ($("#editQuiz div:last").attr('id'));
    var tempQuestionNum = parseInt(tempID.substring(6)) + 1;
    addQuestion(tempQuestionNum);
    e.preventDefault();
  });

  // submit newly created quiz
  $("#editQuizForm").on('click', '#createquizsubmit', function(e) {
    e.preventDefault();
    var radioChecked = true;
    var textInput = true;
    $("#editQuiz > div").each(function() {
      var tempID = $(this).attr('id');
      var tempQuestionNum = parseInt(tempID.substring(11));
      if(!$("input:radio[name='answersr" + tempQuestionNum + "']").is(":checked")){
        radioChecked = false;
        return false;
      }
    });

    $(':text').not(document.getElementById("firstName")).each(function() {
      if(!($.trim($(this).val()).length > 0)) {
        $(this).css({ "border": '#FF0000 1px solid'});
        textInput = false;
      }
      else {
        $(this).css({ "border": '1px solid #ccc'});
      }
    });

    if (radioChecked && textInput) {
      submitCreatedQuiz();
    }
    else {
      $('#placeholderWarning > p > span').text("Please select correct answers and fill out all text fields for each question!");
      $('#placeholderWarning > p > span').append('&nbsp;');
      $('#placeholderWarning').show();
      $("#placeholderWarning").fadeTo(6000, 500).slideUp(500, function(){
        $("#placeholderWarning").hide();
      });
    }
  });
});
// After name is submitted on initial screen
function nameForm(){
  name = $('#nameForm').serializeArray()[0]["value"];
  if (name.length === 0) {
    $('#firstName').css({ "border": '1px solid #FF0000'});
    $('#nameFormWarning').show();
    $("#nameFormWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
      $("#nameFormWarning").hide();
    });
  }
  else {
    $('#firstName').css({ "border": '1px solid #ccc'});
    $('#nameFormWarning').hide();
    $('#nameForm').hide();
    $('#welcome').text("Welcome " + name + "!");
    $('#welcome').prepend('<a href="/"><img src="static/HomeIcon.png" width="38" height="38" id="homeImg" alt=""></a>');
    selectedQuiz = ids[titles.indexOf($('#titlesDropdown option:selected').text())];
    var selectedTitle = $('#titlesDropdown option:selected').text();
    $('#title').text(selectedTitle);
    document.title = selectedTitle;
    loadQuiz(selectedQuiz);
  }
}

// load titles in allQuizzes
function loadTitles(){
  $.getJSON('titlesandids')
  .done(function (data) {
    $('#ajaxloading').hide();
    $('#backHome').hide();
    $('#reload').hide();
    titles = data.slice(0,data.length/2);
    ids = data.slice(data.length/2);
    if (titles === undefined) {
      $('#ajaxloading').text("Sorry, we cannot load the quizzes. Please reload the page to try again.");
      $('#ajaxloading').show();
      $('#reload').show();
    }
    else {
      $("#titlesDropdown").empty();
      for (var i = 0; i < titles.length; i++) {
        var select = document.getElementById("titlesDropdown");
        var option = document.createElement("option");
        var aTag = document.createElement("a");
        option.appendChild(document.createTextNode(titles[i]));
        select.appendChild(option);
      }
    }
  })
  .fail(function() {
    $('#ajaxloading').text("Sorry, we cannot load the quizzes. Please reload the page to try again.");
    $('#ajaxloading').show();
    $('#reload').show();
  })
  .always(function() {
    $('#reload').on('click', function(e){
      e.preventDefault();
      loadTitles();
    });
  });
}

function resetQuizzes() {
  $.ajax({
  type:"GET",
  url: "reset",
  timeout: 2000,
  beforeSend: function(){
    $("#reset_quiz").attr("disabled", true);
      // console.log ("BEFORE RESET SEND");
    },
    complete: function() {
      // console.log ("COMPLETE RESET LOADING");
      $('#ajaxloading').hide();
      $('#backHome').hide();
      $('#reload').hide();
      $('#placeholderSuccess > p > span').text("Quizzes have been reset!");
      $('#placeholderSuccess > p > span').append('&nbsp;');
      $('#placeholderSuccess').show();
      $("#placeholderSuccess").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
        $("#placeholderSuccess").hide();
      });
      $("#reset_quiz").attr("disabled", false);
      loadTitles();
    },
    success: function(data){
      // console.log("RESET sent");
    },
    fail: function(){
      // console.log ('RESET FAIL');
      $('#ajaxloading').text("Sorry, we cannot reset the quizzes. Please reload the page to try again.");
      $('#ajaxloading').show();
      $('#reload').show();
    },
    always: function() {
      $('#reload').on('click', function(e){
        e.preventDefault();
        resetQuizzes();
      });
    }
  });
}

// load target quiz json
function loadQuiz(target){
  $.getJSON('quiz/' + target)
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
      $('#description').text(quiz["description"]);
      $('#description').show();
      nextQuestion();
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
      loadQuiz(target);
    });
  });
}

function loadQuizToCreate() {
  $('#editQuiz').empty();
  $('<label>').attr({
    for: 'titleLabel',
      id: 'titleLabel'
  }).appendTo('#editQuiz');
  $("#titleLabel").text("Quiz Title:");
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'text',
    id: 'titleInput',
    name: 'title',
    class: 'form-control',
    placeholder: "Quiz Title"
  }).appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');

  $('<label>').attr({
    for: 'descriptionLabel',
      id: 'descriptionLabel'
  }).appendTo('#editQuiz');
  $("#descriptionLabel").text("Quiz Description:");
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'text',
    id: 'descriptionInput',
    name: 'metaTags',
    class: 'form-control',
    placeholder: "Quiz Description"
  }).appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');

  $('<label>').attr({
    for: 'quizMetaTagsLabel',
      id: 'quizMetaTagsLabel'
  }).appendTo('#editQuiz');
  $("#quizMetaTagsLabel").text("Quiz Meta Tags:");
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'text',
    id: 'quizMetaTagsInput',
    name: 'metaTags',
    class: 'form-control',
    placeholder: 'Quiz Meta Tags (ex: tag, tag, tag)'
  }).appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');

  $('<label>').attr({
    for: 'difficultyLabel',
      id: 'difficultyLabel'
  }).appendTo('#editQuiz');
  $("#difficultyLabel").text("Quiz Difficulty:");
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'text',
    id: 'difficultyInput',
    name: 'difficulty',
    class: 'form-control',
    placeholder: "Quiz Difficulty"
  }).appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');

  for (var i = 0; i < 3; i++) {
    if (i === 0) {
      var tempQuestionNum = 0;
      var defaultNumOfAnswers = 1; //2 answers
      $('<div>').attr({
        class: 'container',
        id: 'questiondiv'+tempQuestionNum,
        name: 'questions'
      }).appendTo("#editQuiz");
      $('<label>').attr({
        for: 'questionlabel'+tempQuestionNum,
          id: 'questionlabel'+tempQuestionNum
      }).appendTo('#questiondiv'+tempQuestionNum);
      $("#questionlabel"+tempQuestionNum).text("Question "+(tempQuestionNum+1));
      $('<button>').attr({
        id: 'removeQuestion-'+tempQuestionNum,
        class: 'btn btn-danger removeQuestion'
      }).appendTo('#questiondiv'+tempQuestionNum);
      $("#removeQuestion-"+tempQuestionNum).text("Remove question");
      $('<input>').attr({
        type: 'text',
        id: 'question'+tempQuestionNum,
        name: 'questions',
        class: 'form-control',
        placeholder: "Question"
      }).appendTo('#questiondiv'+tempQuestionNum);
      $('<br>').appendTo('#questiondiv'+tempQuestionNum);
      $('<label>').attr({
        for: 'answerLabel'+tempQuestionNum,
          id: 'answerLabel'+tempQuestionNum,
        class: 'answerLabel'
      }).appendTo('#questiondiv'+tempQuestionNum);
      $("#answerLabel"+tempQuestionNum).text("Answer Choices:");
      $('<button>').attr({
        id: 'editQuizAddAns-'+tempQuestionNum+'-'+(defaultNumOfAnswers),
        class: 'btn btn-success editQuizAddAns editQuizAddRemoveAns'
      }).appendTo('#questiondiv'+tempQuestionNum);
      $("#editQuizAddAns-"+tempQuestionNum+'-'+(defaultNumOfAnswers)).text("+");
      $('<button>').attr({
        id: 'editQuizRemoveAns-'+tempQuestionNum+'-'+(defaultNumOfAnswers),
        class: 'btn btn-danger editQuizRemoveAns editQuizAddRemoveAns'
      }).appendTo('#questiondiv'+tempQuestionNum);
      $("#editQuizRemoveAns-"+tempQuestionNum+'-'+(defaultNumOfAnswers)).text("—");
      $('<br>').appendTo('#questiondiv'+tempQuestionNum);
      $('<br>').appendTo('#questiondiv'+tempQuestionNum);
      $('<div>').attr({
        class: 'container',
        id: 'answer'+tempQuestionNum,
        name: 'answers'
      }).appendTo('#questiondiv'+tempQuestionNum);
      for (var a = 0; a < defaultNumOfAnswers+1; a++) {
        $('<input>').attr({
          type: 'radio',
          name: 'answersr'+tempQuestionNum,
          class: 'answersradioclass',
          id: 'answerradiobutton-'+tempQuestionNum+'-'+a
        }).appendTo('#answer' + tempQuestionNum);
        $('<input>').attr({
          id: 'answer-'+tempQuestionNum+'-'+a,
          type: 'text',
          class: 'form-control editanswers',
          name: 'answers',
          placeholder: "Answer Choice"
        }).appendTo('#answer' + tempQuestionNum);
        $('<br>').attr({
          id: 'br-'+tempQuestionNum+'-'+a
        }).appendTo('#answer' + tempQuestionNum);
      }
      $('<br>').appendTo('#questiondiv'+tempQuestionNum);
      $('<label>').attr({
        for: 'metaTags'+tempQuestionNum,
          id: 'metaTagsLabel'+tempQuestionNum,
        class: 'answerLabel'
      }).appendTo('#questiondiv'+tempQuestionNum);
      $("#metaTagsLabel"+tempQuestionNum).text("Meta Tags:");
      $('<br>').appendTo('#questiondiv'+tempQuestionNum);
      $('<input>').attr({
        type: 'text',
        id: 'metaTag'+tempQuestionNum,
        name: 'metaTag',
        class: 'form-control',
        placeholder: 'Meta Tags for Question (ex: tag, tag, tag)'
      }).appendTo('#questiondiv'+tempQuestionNum);
      $('<br>').appendTo('#questiondiv'+tempQuestionNum);
    }
    else {
      var tempID = ($("#editQuiz div:last").attr('id'));
      var tempQuestionNum = parseInt(tempID.substring(6)) + 1;
      addQuestion(tempQuestionNum);
    }
  }
  $('<button>').attr({
    id: 'addQuestion',
    class: 'btn btn-success'
  }).appendTo('#editQuiz');
  $("#addQuestion").text("Add a question");
  $('<br>').appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'submit',
    id: 'createquizsubmit',
    class: 'btn btn-warning',
    text: 'Submit'
  }).appendTo('#editQuiz');
  $('#editQuiz').show();
}

// load quiz for "update quizzes"
function loadQuizToEdit(target) {
  $.getJSON('quiz/' + selectedQuiz)
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
      editQuizFormat();
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
      loadQuizToEdit(target);
    });
  });
}

function editQuizFormat(){
  $('#editQuiz').show();
  $('#editQuiz').empty();
  $('<label>').attr({
    for: 'titleLabel',
      id: 'titleLabel'
  }).appendTo('#editQuiz');
  $("#titleLabel").text("Quiz Title:");
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'text',
    id: 'titleInput',
    name: 'title',
    class: 'form-control',
    value: quiz["title"],
    placeholder: "Quiz Title"
  }).appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');

  $('<label>').attr({
    for: 'descriptionLabel',
      id: 'descriptionLabel'
  }).appendTo('#editQuiz');
  $("#descriptionLabel").text("Quiz Description:");
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'text',
    id: 'descriptionInput',
    name: 'metaTags',
    class: 'form-control',
    value: quiz["description"],
    placeholder: "Quiz Description"
  }).appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');

  $('<label>').attr({
    for: 'quizMetaTagsLabel',
      id: 'quizMetaTagsLabel'
  }).appendTo('#editQuiz');
  $("#quizMetaTagsLabel").text("Quiz Meta Tags:");
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'text',
    id: 'quizMetaTagsInput',
    name: 'metaTags',
    class: 'form-control',
    value: quiz["meta_tags"],
    placeholder: "Quiz Meta Tags"
  }).appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');

  $('<label>').attr({
    for: 'difficultyLabel',
      id: 'difficultyLabel'
  }).appendTo('#editQuiz');
  $("#difficultyLabel").text("Quiz Difficulty:");
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'text',
    id: 'difficultyInput',
    name: 'difficulty',
    class: 'form-control',
    value: quiz["difficulty"],
    placeholder: "Quiz Difficulty"
  }).appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');

  for (var i = 0; i < quizLength; i++) {
    $('<div>').attr({
      class: 'container',
      id: 'questiondiv'+i,
      name: 'questions'
    }).appendTo('#editQuiz');
    $('<label>').attr({
      for: 'questionlabel'+i,
        id: 'questionlabel'+i
    }).appendTo('#questiondiv'+i);
    $("#questionlabel"+i).text("Question "+(i+1));
    $('<button>').attr({
      id: 'removeQuestion-'+i,
      class: 'btn btn-danger removeQuestion'
    }).appendTo('#questiondiv'+i);
    $("#removeQuestion-"+i).text("Remove question");
    $('<input>').attr({
      type: 'text',
      id: 'question'+i,
      name: 'questions',
      class: 'form-control',
      value: quiz["questions"][i]["text"],
      placeholder: "Question"
    }).appendTo('#questiondiv'+i);
    $('<br>').appendTo('#questiondiv'+i);
    $('<label>').attr({
      for: 'answerLabel'+i,
        id: 'answerLabel'+i,
      class: 'answerLabel'
    }).appendTo('#questiondiv'+i);
    $("#answerLabel"+i).text("Answer Choices:");
    $('<button>').attr({
      id: 'editQuizAddAns-'+i+'-'+(quiz["questions"][i]["answers"].length-1),
      class: 'btn btn-success editQuizAddAns editQuizAddRemoveAns'
    }).appendTo('#questiondiv'+i);
    $("#editQuizAddAns-"+i+'-'+(quiz["questions"][i]["answers"].length-1)).text("+");
    $('<button>').attr({
      id: 'editQuizRemoveAns-'+i+'-'+(quiz["questions"][i]["answers"].length-1),
      class: 'btn btn-danger editQuizRemoveAns editQuizAddRemoveAns'
    }).appendTo('#questiondiv'+i);
    $("#editQuizRemoveAns-"+i+'-'+(quiz["questions"][i]["answers"].length-1)).text("—");
    $('<br>').appendTo('#questiondiv'+i);
    $('<br>').appendTo('#questiondiv'+i);
    $('<div>').attr({
      class: 'container',
      id: 'answer'+i,
      name: 'answers'
    }).appendTo('#questiondiv'+i);
    for (var a = 0; a < quiz["questions"][i]["answers"].length; a++) {
      $('<input>').attr({
        type: 'radio',
        name: 'answersr'+i,
        class: 'answersradioclass',
        id: 'answerradiobutton-'+i+'-'+a
      }).appendTo('#answer' + i);
      $('<input>').attr({
        id: 'answer-'+i+'-'+a,
        type: 'text',
        class: 'form-control editanswers',
        name: 'answers',
        value: quiz["questions"][i]["answers"][a],
        placeholder: "Answer Choice"
      }).appendTo('#answer' + i);
      if (quiz["questions"][i]["correct_answer"] === a) {
        document.getElementById('answer-'+i+'-'+a).style.borderColor = "green";
        document.getElementById('answer-'+i+'-'+a).style.borderWidth = "thick";
        $('input[name="answersr' + i + '"][id="answerradiobutton-'+i+'-'+a+'"]').prop('checked',true);
      }
      $('<br>').attr({
        id: 'br-'+i+'-'+a
      }).appendTo('#answer' + i);
    }
    $('<br>').appendTo('#questiondiv'+i);
    $('<label>').attr({
      for: 'metaTags'+i,
        id: 'metaTagsLabel'+i,
      class: 'answerLabel'
    }).appendTo('#questiondiv'+i);
    $("#metaTagsLabel"+i).text("Meta Tags:");
    $('<br>').appendTo('#questiondiv'+i);
    $('<input>').attr({
      type: 'text',
      id: 'metaTag'+i,
      name: 'metaTag',
      class: 'form-control',
      value: quiz["questions"][i]["meta_tags"],
      placeholder: 'Meta Tags for Question (ex: tag, tag, tag)'
    }).appendTo('#questiondiv'+i);
    $('<br>').appendTo('#questiondiv'+i);
  }
  $('<br>').appendTo('#questiondiv'+i);
  $('<button>').attr({
    id: 'addQuestion',
    class: 'btn btn-success'
  }).appendTo('#editQuiz');
  $("#addQuestion").text("Add a question");
  $('<br>').appendTo('#editQuiz');
  $('<br>').appendTo('#editQuiz');
  $('<input>').attr({
    type: 'submit',
    id: 'editquizsubmit',
    class: 'btn btn-warning',
    text: 'Submit'
  }).appendTo('#editQuiz');
}

function addQuestion(tempQuestionNum) {
  var defaultNumOfAnswers = 1; //2 answers
  if (($("#editQuiz > div").length) < 25) {
    $('<div>').attr({
      class: 'container',
      id: 'questiondiv'+tempQuestionNum,
      name: 'questions'
    }).insertAfter("#questiondiv" + (tempQuestionNum-1));
    $('<label>').attr({
      for: 'questionlabel'+tempQuestionNum,
        id: 'questionlabel'+tempQuestionNum
    }).appendTo('#questiondiv'+tempQuestionNum);
    $("#questionlabel"+tempQuestionNum).text("Question "+(tempQuestionNum+1));
    $('<button>').attr({
      id: 'removeQuestion-'+tempQuestionNum,
      class: 'btn btn-danger removeQuestion'
    }).appendTo('#questiondiv'+tempQuestionNum);
    $("#removeQuestion-"+tempQuestionNum).text("Remove question");
    $('<input>').attr({
      type: 'text',
      id: 'question'+tempQuestionNum,
      name: 'questions',
      class: 'form-control',
      placeholder: "Question"
    }).appendTo('#questiondiv'+tempQuestionNum);
    $('<br>').appendTo('#questiondiv'+tempQuestionNum);
    $('<label>').attr({
      for: 'answerLabel'+tempQuestionNum,
        id: 'answerLabel'+tempQuestionNum,
      class: 'answerLabel'
    }).appendTo('#questiondiv'+tempQuestionNum);
    $("#answerLabel"+tempQuestionNum).text("Answer Choices:");
    $('<button>').attr({
      id: 'editQuizAddAns-'+tempQuestionNum+'-'+(defaultNumOfAnswers),
      class: 'btn btn-success editQuizAddAns editQuizAddRemoveAns'
    }).appendTo('#questiondiv'+tempQuestionNum);
    $("#editQuizAddAns-"+tempQuestionNum+'-'+(defaultNumOfAnswers)).text("+");
    $('<button>').attr({
      id: 'editQuizRemoveAns-'+tempQuestionNum+'-'+(defaultNumOfAnswers),
      class: 'btn btn-danger editQuizRemoveAns editQuizAddRemoveAns'
    }).appendTo('#questiondiv'+tempQuestionNum);
    $("#editQuizRemoveAns-"+tempQuestionNum+'-'+(defaultNumOfAnswers)).text("—");
    $('<br>').appendTo('#questiondiv'+tempQuestionNum);
    $('<br>').appendTo('#questiondiv'+tempQuestionNum);
    $('<div>').attr({
      class: 'container',
      id: 'answer'+tempQuestionNum,
      name: 'answers'
    }).appendTo('#questiondiv'+tempQuestionNum);
    for (var a = 0; a < defaultNumOfAnswers+1; a++) {
      $('<input>').attr({
        type: 'radio',
        name: 'answersr'+tempQuestionNum,
        class: 'answersradioclass',
        id: 'answerradiobutton-'+tempQuestionNum+'-'+a
      }).appendTo('#answer' + tempQuestionNum);
      $('<input>').attr({
        id: 'answer-'+tempQuestionNum+'-'+a,
        type: 'text',
        class: 'form-control editanswers',
        name: 'answers',
        placeholder: "Answer Choice"
      }).appendTo('#answer' + tempQuestionNum);
      $('<br>').attr({
        id: 'br-'+tempQuestionNum+'-'+a
      }).appendTo('#answer' + tempQuestionNum);
    }
    $('<br>').appendTo('#questiondiv'+tempQuestionNum);
    $('<label>').attr({
      for: 'metaTags'+tempQuestionNum,
        id: 'metaTagsLabel'+tempQuestionNum,
      class: 'answerLabel'
    }).appendTo('#questiondiv'+tempQuestionNum);
    $("#metaTagsLabel"+tempQuestionNum).text("Meta Tags:");
    $('<br>').appendTo('#questiondiv'+tempQuestionNum);
    $('<input>').attr({
      type: 'text',
      id: 'metaTag'+tempQuestionNum,
      name: 'metaTag',
      class: 'form-control',
      placeholder: "Meta Tags for Question (ex: tag, tag, tag)"
    }).appendTo('#questiondiv'+tempQuestionNum);
    $('<br>').appendTo('#questiondiv'+tempQuestionNum);
  } 
  else {
    $('#placeholderWarning > p > span').text("Cannot add question - reached maximum number of questions!");
    $('#placeholderWarning > p > span').append('&nbsp;');
    $('#placeholderWarning').show();
    $("#placeholderWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
      $("#placeholderWarning").hide();
    });
  }
}

function submitCreatedQuiz(){
  var tempTitle = $("#titleInput").val();
  var tempQuizMetaTags = $("#quizMetaTagsInput").val().split(",");
  var tempQuizDescription = $("#descriptionInput").val();
  var tempQuizDifficulty = $("#difficultyInput").val();
  var tempJSON = {
    "id": 0,
    "title": tempTitle,
    "description": tempQuizDescription,
    "meta_tags": tempQuizMetaTags,
    "difficulty": tempQuizDifficulty,
    "questions": []
  };
  var divSize = $("#editQuiz > div").length;
  $("#editQuiz > div").each(function() {
    var tempID = $(this).attr('id');
    var tempQuestionNum = parseInt(tempID.substring(11));
    var tempAnswers = [];
    $("#answer"+tempQuestionNum+ " .editanswers").each(function(){
      tempAnswers.push($(this).val());
    });
    var tempChunks = $('input[name=answersr' + tempQuestionNum + ']:checked', '#editQuizForm').attr("id").split("-");
    var tempCorrectAnswer = parseInt(tempChunks[2]);
    var tempMetaTags = $("#metaTag"+tempQuestionNum).val().split(",");
    var tempQuestion = {
      "text": $("#question"+tempQuestionNum).val(),
      "answers": tempAnswers,
      "correct_answer": tempCorrectAnswer,
      "global_correct": 0,
      "global_total": 0,
      "meta_tags": tempMetaTags
    };
    tempJSON["questions"].push(tempQuestion);
  });
  $.ajax({
    type:"POST",
    url: "quiz",
    data: JSON.stringify(tempJSON),
    timeout: 2000,
    contentType: "application/json; charset=utf-8",
    beforeSend: function(){
      // console.log ("BEFORE EDIT QUIZ SEND");
    },
    complete: function() {
      // console.log ("COMPLETE EDIT QUIZ LOADING");
    },
    success: function(data){
      // console.log("edited quiz sent");
      $('#editQuiz').hide();
      $('#placeholderSuccess > p > span').text("Quiz has been updated!");
      $('#placeholderSuccess > p > span').append('&nbsp;');
      $('#placeholderSuccess').show();
      $("#placeholderSuccess").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
        $("#placeholderSuccess").hide();
      });
      loadTitles();
    },
    fail: function(){
      // console.log("EDIT QUIZ FAILED");
    }
  });
}

function submitEditedQuiz(){
  var tempTitle = $("#titleInput").val();
  var tempQuizMetaTags = $("#quizMetaTagsInput").val().split(",");
  var tempQuizDescription = $("#descriptionInput").val();
  var tempQuizDifficulty = $("#difficultyInput").val();
  var tempJSON = {
    "id": quiz["id"],
    "title": tempTitle,
    "description": tempQuizDescription,
    "meta_tags": tempQuizMetaTags,
    "difficulty": tempQuizDifficulty,
    "questions": []
  };
  var divSize = $("#editQuiz > div").length;
  // console.log($("#editQuiz > div"));
  $("#editQuiz > div").each(function() {
    var tempID = $(this).attr('id');
    var tempQuestionNum = parseInt(tempID.substring(11));
    var tempAnswers = [];
    $("#answer"+tempQuestionNum+ " .editanswers").each(function(){
      tempAnswers.push($(this).val());
    });
    var tempChunks = $('input[name=answersr' + tempQuestionNum + ']:checked', '#editQuizForm').attr("id").split("-");
    var tempCorrectAnswer = parseInt(tempChunks[2]);
    var tempMetaTags = $("#metaTag"+tempQuestionNum).val().split(",");
    var tempQuestion = {
      "text": $("#question"+tempQuestionNum).val(),
      "answers": tempAnswers,
      "correct_answer": tempCorrectAnswer,
      "global_correct": 0,
      "global_total": 0,
      "meta_tags": tempMetaTags
    };
    tempJSON["questions"].push(tempQuestion);
  });
  $.ajax({
    type:"PUT",
    url: "quiz/" + quiz["id"],
    data: JSON.stringify(tempJSON),
    timeout: 2000,
    contentType: "application/json; charset=utf-8",
    beforeSend: function(){
        // console.log ("BEFORE EDIT QUIZ SEND");
      },
      complete: function() {
        // console.log ("COMPLETE EDIT QUIZ LOADING");
      },
      success: function(data){
        // console.log("edited quiz sent");
        $('#editQuiz').hide();
        loadTitles();
        $('#placeholderSuccess > p > span').text("Quiz has been updated!");
        $('#placeholderSuccess > p > span').append('&nbsp;');
        $('#placeholderSuccess').show();
        $("#placeholderSuccess").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
          $("#placeholderSuccess").hide();
        });
      },
      fail: function(){
        // console.log("EDIT QUIZ FAILED");
      }
    });
}

// Show questions and answers
function generateQA (){
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
  var tempTags = "";
  for (var z = 0; z < quiz["questions"][currentQuestion]["meta_tags"].length; z++) {
    tempTags+=quiz["questions"][currentQuestion]["meta_tags"][z] + ", ";
  }
  $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
  {
    tags: tempTags,
    tagmode: "any",
    format: "json"
  },
  function(data) {
    $.each(data.items, function(i,item){
      $( "#images" ).empty();
      $("<img />").attr("src", item.media.m).appendTo("#images");
      $( "#images" ).hide().fadeIn("slow");
      if ( i == 0 ) return false;
    });
  });
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

// top ten users
function topTen(allUsers) {
  allUsers.sort(function(a,b) {
    return ((b["user_correct"]*1.0)/b["user_total"]) - ((a["user_correct"]*1.0)/a["user_total"]);
  });
  for (var i = 0; i < 10; i++) {
    if (i < allUsers.length) {
      $('#userTable > tbody:last-child').append('<tr class="success"><td>' + allUsers[i]["name"] +
        '</td><td>' + Math.round((allUsers[i]["user_correct"]*100)/allUsers[i]["user_total"]) + "%" +
        '</td></tr>');
    }
    else break;
  }
  $('#userTable').fadeIn();
  $('#tenScores').fadeIn();
}

// user info
function userScore() {
  $.getJSON('users')
  .done(function (data) {
    userJSON = data;
    currentUser = userJSON.length;
    for (var i = 0; i < userJSON.length; i++) {
      if (userJSON[i].name === name) {
        currentUser = i;
        break;
      }
    }
    // if new user
    if (currentUser === userJSON.length) {
      var newUser = {
        "name": name,
        "user_correct": 0,
        "user_total": 0
      };
      userJSON[currentUser] = newUser;
    }
    for (var n = 0; n < quizLength; n++){
      if (userAnswers[n][1]) {
        quiz["questions"][n]["global_correct"]+=1;
        userJSON[currentUser]["user_correct"]+=1;
      }
      quiz["questions"][n]["global_total"]+=1;
      userJSON[currentUser]["user_total"]+=1;
    }
    topTen(userJSON);

    // User Scores
    $.ajax({
      type:"POST",
      url: "users",
      data: JSON.stringify(userJSON),
      timeout: 2000,
      contentType: "application/json; charset=utf-8",
      beforeSend: function(){
        // console.log ("BEFORE USER SEND");
      },
      complete: function() {
        // console.log ("COMPLETE USER LOADING");
      },
      success: function(data){
        // console.log("users sent");
      },
      fail: function(){
        // console.log("USER FAILED");
      }
    });
    createPieChart(quizLength-score, score, ((quizLength-score)*100)/quizLength, 100*score/quizLength);
  })
  .fail(function() {
    // console.log("Failed to load user JSON");
    for (var i = 0; i < quizLength; i++){
      if (userAnswers[i][1]) {
        quiz["questions"][i]["global_correct"]+=1;
      }
      quiz["questions"][i]["global_total"]+=1;
    }
    createPieChart(quizLength-score, score, ((quizLength-score)*100)/quizLength, 100*score/quizLength);
  });
}

// Calculate Score and add to global + user scores
function calculateScore() {
  for (var i = 0; i < quizLength; i++){
    if (userAnswers[i][1]) {
      quiz["questions"][i]["global_correct"]+=1;
      score++;
    }
    quiz["questions"][i]["global_total"]+=1;
  }
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
        '</td></tr>');
    else
      $('#scoreTable > tbody:last-child').append('<tr class="danger"><td class="questionNum">' + (r + 1) + '. ' + quiz["questions"][r]["text"] +
        '</td><td>' + quiz["questions"][r]["answers"][userAnswers[r][2]] +
        '<td>' + quiz["questions"][r]["answers"][quiz["questions"][r]["correct_answer"]] +
        '</td><td>' + scorePercent + "%" +
        '</td></tr>');
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

// Go to next question in quiz
function nextQuestion() {
  // Before end of quiz
  if (currentQuestion<quizLength-1) {
    // if one of the quiz questions
    if (currentQuestion > -1) {
      // if no answer is checked
      if (!$("input[name='answers']").is(':checked')){
        $('#answerWarning').show();
        $("#answerWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
          $("#answerWarning").hide();
        });
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
      $("#answerWarning").fadeTo(notificationFadeTime, 500).slideUp(500, function(){
        $("#answerWarning").hide();
      });
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
      $('#images').hide();
      $('#piechart').fadeIn("slow");
      $('#home').show();
      calculateScore();
      $('#nameScore').text(name + ", your score on this quiz is: " + score + "/" + quizLength + " questions or " + Math.round(100*score/quizLength) + "%");
      scorePerQuestionTable();

      // Global Scores
      $.ajax({
        type:"PUT",
        url: "quiz/" + quiz["id"],
        data: JSON.stringify(quiz),
        timeout: 2000,
        contentType: "application/json; charset=utf-8",
        beforeSend: function(){
          // console.log ("BEFORE SEND");
        },
        complete: function() {
          // console.log ("COMPLETE LOADING");
        },
        success: function(data){
          // console.log("quiz sent");
        },
        fail: function(){
          // console.log("FAILED");
        }
      });
      userScore();
    }
  }

}