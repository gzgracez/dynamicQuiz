/*//update title of tab
Take Quiz, modify quiz, edit quiz, delete quiz
use templating for dropdown quiz selection?
*/
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var path = require('ejs');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var content = fs.readFileSync("static/index.html", 'utf8');
app.use("/static", express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  var titles = [];
  for (var i = 0; i<jsonContent.length; i++) {
    titles[i] = jsonContent[i]["title"];
  }
  res.render('index',{titles: titles});
});

app.get('/titles', function (req, res) {
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  var titles = "[";
  for (var i = 0; i<jsonContent.length; i++) {
    if (i < jsonContent.length -1)
      titles += "\"" + jsonContent[i]["title"] + "\"" + ", ";
    else
      titles += "\"" + jsonContent[i]["title"] + "\"";
  }
  titles += "]";
  res.send(titles);
});

app.get('/quiz', function (req, res) {
  var readQuiz = fs.readFileSync("data/quiz.json", 'utf8');
  res.send(readQuiz);
});

app.post('/quiz', function(req, res){
  var jsonString = JSON.stringify(req.body);
  fs.writeFile("data/quiz.json", jsonString);
  res.send(req.body);
});

app.get('/users', function (req, res) {
  var readUsers = fs.readFileSync("data/users.json", 'utf8');
  res.send(readUsers);
});

//handler for /user/:id which responds with the user id
app.get('/quiz/:id', function (req, res) {
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  var targetQuiz = jsonContent[req.params.id];
  res.send(targetQuiz);
});

app.post('/quiz/:id', function (req, res) {
  var sentTargetQuiz = JSON.parse(req.body);
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);

  jsonContent[req.params.id] = sentTargetQuiz;
  var jsonString = JSON.stringify(jsonContent);
  fs.writeFile("data/allQuizzes.json", jsonString);
  res.send(req.body);
});

app.put('/quiz/:id', function (req, res) {
  var sentQuiz = JSON.parse(req.body);

  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  jsonContent[req.params.id] = sentQuiz;

  var jsonString = JSON.stringify(jsonContent);
  fs.writeFile("data/allQuizzes.json", jsonString);

  res.send("updated");
});

app.delete('/quiz/:id', function (req, res) {
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  jsonContent.splice(req.params.id, 1);
  var jsonString = JSON.stringify(jsonContent);
  fs.writeFile("data/allQuizzes.json", jsonString);
  res.send("deleted");
});

app.post('/users', function(req, res){
  var jsonString = JSON.stringify(req.body);
  fs.writeFile("data/users.json", jsonString);
  res.send(req.body);
});

var server = app.listen(process.env.PORT || 4000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});