var path = require('path');
var config = require('../databasemysql.js');
var con = config.connection;
var alert

// Display detail page for a specific user.
exports.frontpage_get = function(req, res) {
	if(req.session.loggedin == true && req.session.email) {
		res.redirect('/user');
	}
    res.sendFile(path.join(__dirname + '/../views/login.html'));
};

exports.login_post = function(req, res) {

    var email = req.body.email;
	var password = req.body.password;

	if (email && password) {
		con.query('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, req.body.password], function(error, results, fields) {
			if (results.length > 0) {

				var user = results[0];

				req.session.loggedin = true;
				req.session.email = req.body.email;
				req.session.interest = user.interest;
				req.session.gender = user.gender;

				res.redirect('/user');
			} else {
				res.send('User does not exsist');
			}			
			res.end();
		});
	} else {
		response.send('Please enter user email and password!');
		response.end();
	}
};

/*con.connect(function(err) {
	if (err) throw err;
	var sql = 'DELETE FROM users WHERE email = ?';,
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  console.log("Number of records deleted: " + result.affectedRows);
	});
  });
  */

exports.logout = function(req, res) {

    var email = req.session.email;
	var loggedin = req.session.loggedin;

	if (email && loggedin) { 
		req.session.destroy();
	}
	res.redirect('/');
};