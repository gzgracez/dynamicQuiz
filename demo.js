// Read Synchronously
/*
 var fs = require("fs");
 console.log("\n *START* \n");
 var content = fs.readFileSync("dummy.json", 'utf8');
 console.log("Output Content : \n"+ content);
 console.log("\n *EXIT* \n");
 */

// Read Asynchronously

 var fs = require("fs");
 console.log("\n *START* \n");
 var content = fs.readFile("content2.txt", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

 console.log("Output Content : \n"+ content);
 console.log("\n *EXIT* \n");
 