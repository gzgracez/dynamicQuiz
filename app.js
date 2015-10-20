var express = require('express');
var app = express();
var path = require('path');
app.use("/static", express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  // res.send('Hello World!');
	res.writeHead(200, {'Content-Type': 'text/html'});
	var page = '<html class="no-js" lang="en" ><head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Dynamic Quiz</title> <link rel="stylesheet" href="static/css/bootstrap.min.css"> <link rel="stylesheet" href="static/css/styles2.css"> <link rel="shortcut icon" href="static/1.ico"/></head><body> <div class="container"> <h1 id="title"></h1> <div class="alert alert-danger" id="nameFormWarning" role="alert"> <p class="nameAlert">Please enter your name before proceeding!&nbsp;<a href="#" class="close nameAlert" data-hide="alert">&times;</a></p></div><form id="nameForm" role="form"> <div class="form-group"> <label for="name">First Name:</label> <input type="text" name="nameValue" placeholder="First Name" class="form-control"><br><input class="btn btn-primary" class="form-control" type="submit" value="Submit"> </div></form> <h2 id="welcome"></h2> <div class="alert alert-danger" id="answerWarning" role="alert"> <p class="nameAlert">Please choose an answer before proceeding!&nbsp;<a href="#" class="close nameAlert" data-hide="alert">&times;</a></p></div><h3 id="questionNumber"></h3> <h3 id="question"></h3> <form id="answerChoices"> <input type="radio" name="answers" id="0"> <label for="0" id="ansLabels"></label><br><input type="radio" name="answers" id="1"> <label for="1" id="ansLabels"></label><br><input type="radio" name="answers" id="2"> <label for="2" id="ansLabels"></label><br><input type="radio" name="answers" id="3"> <label for="3" id="ansLabels"></label><br><input type="radio" name="answers" id="4"> <label for="4" id="ansLabels"></label> </form> <button id="previousQuestion" class="btn btn-danger btn-sm"><< Back</button> <button id="nextQuestion" class="btn btn-success btn-sm">Next >></button> <h2 id="nameScore"></h2> <center> <canvas id="piechart" width="480" height="250"></canvas> </center> <table class="table table-hover" id="scoreTable"> <thead> <tr> <th>Question</th> <th>Your Answer</th> <th>Correct Answer</th> </tr><tbody> </tbody> </thead> </table> <center> <a href="" id="home" class="btn btn-primary btn-sm">Back To Home</a> </center> <br></div><script src="static/js/jquery-2.1.4.min.js"></script><script src="static/js/bootstrap.min.js"></script><script src="static/js/quiz.js"></script><script src="static/js/script.js"></script></body></html>';
  res.write(page);
	res.end();
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});