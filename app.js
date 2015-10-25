var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(express.bodyParser());
var content = fs.readFileSync("index.html", 'utf8');
// app.use("/static", express.static(path.join(__dirname, 'static')));
app.use("/static", express.static('static'));

app.get('/', function (req, res) {
  res.send(content);
});

app.post('/static/quiz.json', function(req, res){
	var obj = {};
	var jsonString = JSON.stringify(req.body);
	console.log('body: ' + jsonString);
	fs.writeFile("static/quiz.json", jsonString);
	res.send(req.body);
});

var server = app.listen(process.env.PORT || 4000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});