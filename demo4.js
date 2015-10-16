var fs = require('fs');

var contents = fs.readFileSync("dummy2.json");
var jsonContent = JSON.parse(contents);

var user = {
             "username":"newUser",
             "password":"newUser@123",
             "email":"newUser@abc.com",
             "uid": 2222
 }

//jsonContent.push(user);
jsonContent[jsonContent.length] = user;

var data = JSON.stringify(jsonContent);
 console.log(data);

 fs.writeFile("dummy2.json", data);