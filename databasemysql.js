//MySQL adgang
var mysql = require("mysql");
var config = {
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "Eksamen2",
};

var connection = mysql.createConnection(config);

connection.connect(function (err) {
  if (err) {
    console.log("internal server failed: ");
    return;
  }

  console.log("Connected"); //når der er forbindelse til severen, console logges der "connected" i terminalen
});

module.exports = {
  connection: mysql.createConnection(config),
};
