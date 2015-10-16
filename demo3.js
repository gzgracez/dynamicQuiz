var fs = require('fs');

var obj = {
             "username":"abc",
             "password":"abc@123",
             "email":"abc@abc.com",
             "uid": 2222
 }

 var data = JSON.stringify(obj);
 console.log(data);

 fs.writeFile("content2.txt", data);
