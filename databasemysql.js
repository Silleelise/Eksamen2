var mysql = require('mysql');
var config = {
	host     : 'localhost',
	user     : 'root',
	password : 'admin123',
	database : 'Eksamen2'
};

var connection = mysql.createConnection(config);

connection.connect(function(err) {
  if (err) {
    console.log('internal server failed: ' + err.stack);
    return;
  }

  console.log('connected' + connection.threadId);
});
  
module.exports = {
     connection : mysql.createConnection(config) 
}
