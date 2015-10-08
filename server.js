var http = require ('http');
var server = http.createServer();

server.on('request',function(req,res) {
	res.writeHead(200, {'Content-Type': 'text/html'});

	var page ="";
	page+="<HTML>";
	page+="<HEAD>";
	
	page+="</HEAD>";
	page+="<BODY>";
	page+="<div id='header'>";
	page+="<h1>Hello World!</h1>";
	page+="</div>";
	page+="</BODY>";
	page+="</HTML>";

	res.write(page);
	res.end();
});

server.listen(4000);