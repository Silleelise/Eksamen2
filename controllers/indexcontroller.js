//
var path = require('path');

var config = require('../databaseconfig.js');
var con = config.connection;

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
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
};

exports.logout = function(req, res) {

    var email = req.session.email;
	var loggedin = req.session.loggedin;

	if (email && loggedin) { 
		req.session.destroy();
	}
	res.redirect('/');
};