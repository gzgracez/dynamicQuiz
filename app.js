var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();
var content = fs.readFileSync("index.html", 'utf8');
app.use("/static", express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {

  res.send(content);

});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});