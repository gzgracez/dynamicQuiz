 var fs = require("fs");
 console.log("\n *STARTING* \n");
// Get content from file
var contents = fs.readFileSync("dummy.json");
// Define to JSON type
var jsonContent = JSON.parse(contents);
// Get Value from JSON
console.log("User Name:", jsonContent[0].username);
console.log("Email:", jsonContent[0].email);
console.log("Password:", jsonContent[0].password);
console.log("User Name:", jsonContent[1].username);
console.log("Email:", jsonContent[1].email);
console.log("Password:", jsonContent[1].password);
console.log("\n *EXIT* \n");