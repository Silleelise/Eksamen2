var path = require('path');
var config = require('../databasemysql.js');
var con = config.connection;

// Viser en brugers profil når brugeren er logget ind på siden /profile
exports.frontpage_get = function(req, res) {
	if(req.session.loggedin == true && req.session.email) {
		res.redirect('/profile');
	}
    res.sendFile(path.join(__dirname + '/../views/login.html'));
};

//Logger ind med email og password data fra mysql
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

				res.redirect('/profile'); //Redirecter til /profile hvis session == true og email og password eksisterer 
			} else {
				res.send('User does not exsist'); //ellers smider den denne string
			}			
			res.end();
		});
	} else {
		response.send('Please enter user email and password!');
		response.end();
	}
};

// Logud funktion med sessions
exports.logout = function(req, res) {

    var email = req.session.email;
	var loggedin = req.session.loggedin;

	if (email && loggedin) { 
		req.session.destroy(); //ender session
	}
	res.redirect('/'); //redirecter til forside (login side)
};