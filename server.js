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

app.get('/,/quiz', function (req, res) {
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  var titles = [];
  for (var i = 0; i<jsonContent.length; i++) {
    titles[i] = jsonContent[i]["title"];
  }
  res.send(JSON.stringify(titles));
});

app.post('/quiz', function(req, res){
  var sentQuiz = req.body;
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  if (jsonContent.length > 0) {
    sentQuiz["id"] = jsonContent[jsonContent.length-1]["id"] + 1;
  }
  jsonContent.push(sentQuiz);

  var jsonString = JSON.stringify(jsonContent);
  fs.writeFile("data/allQuizzes.json", jsonString);

  res.send("updated");
});

app.get('/quiz/:id', function (req, res) {
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  var targetQuiz;;
  for (var i = 0; i < jsonContent.length; i++) {
    if (jsonContent[i]["id"] === parseInt(req.params.id)) {
      targetQuiz = jsonContent[i];
      break;
    }
  }
  res.send(targetQuiz);
});

app.put('/quiz/:id', function (req, res) {
  var sentQuiz = req.body;
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  for (var i = 0; i < jsonContent.length; i++) {
    if (jsonContent[i]["id"] === parseInt(req.params.id)) {
      jsonContent[i] = sentQuiz;
      break;
    }
  }

  var jsonString = JSON.stringify(jsonContent);
  fs.writeFile("data/allQuizzes.json", jsonString);

  res.send("updated");
});

app.delete('/quiz/:id', function (req, res) {
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  for (var i = 0; i < jsonContent.length; i++) {
    if (jsonContent[i]["id"] === parseInt(req.params.id)) {
      jsonContent.splice(i, 1);
      break;
    }
  }
  var jsonString = JSON.stringify(jsonContent);
  fs.writeFile("data/allQuizzes.json", jsonString);
  res.send("deleted");
});

app.get('/reset', function (req, res) {
  var readIn = fs.readFileSync("data/defaultallquizzes.json", 'utf8');
  // var readInAdded = fs.readFileSync("data/allQuizzes.json", 'utf8');
  // fs.writeFile("data/allQuizzesRevert.json", readInAdded);
  fs.writeFile("data/allQuizzes.json", readIn);
  res.send("default quizzes restored");
});

app.get('/revert', function (req, res) {
  var readIn = fs.readFileSync("data/allQuizzesRevert.json", 'utf8');
  fs.writeFile("data/allQuizzes.json", readIn);
  res.send("reverted");
});

app.get('/users', function (req, res) {
  var readUsers = fs.readFileSync("data/users.json", 'utf8');
  res.send(readUsers);
});

app.post('/users', function(req, res){
  var jsonString = JSON.stringify(req.body);
  fs.writeFile("data/users.json", jsonString);
  res.send(req.body);
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

app.get('/titlesandids', function (req, res) {
  var readQuiz = fs.readFileSync("data/allQuizzes.json", 'utf8');
  var jsonContent = JSON.parse(readQuiz);
  var titles = [];
  for (var i = 0; i<jsonContent.length; i++) {
    titles[i] = jsonContent[i]["title"];
    titles[jsonContent.length + i] = jsonContent[i]["id"];
  }
  res.send(JSON.stringify(titles));
});


var server = app.listen(process.env.PORT || 4000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});