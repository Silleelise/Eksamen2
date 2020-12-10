//MySQL adgang
var mysql = require("mysql");
var config = {
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "Eksamen2",
};

var connection = mysql.createConnection(config); //definerer MySQL connection

connection.connect(function (err) {
  if (err) {
    console.log("internal server failed: "); //hvis der ikke cnnection til MySQL
    return;
  }
  console.log("Connected"); //når der er forbindelse til MySQL console logges der "connected" i terminalen
});

module.exports = {
  connection: mysql.createConnection(config),
};
