//var User = require('../models/user');
var path = require('path');

var config = require('../databaseconfig.js');
var con = config.connection;

// Display list of all users.
exports.show_possible_match = function(req, res) {
   if(req.session.loggedin == true && req.session.email) {

   		function fetchID(callback) {
	   		con.query('SELECT * FROM users WHERE email = ?', [req.session.email], function(error, results, fields) {
				if (results.length > 0) {
					var user = results[0];
					return callback(user);
				} 		
			});
		   }
		
   		var last_match_id = 0; 

   		fetchID(function(result){  
		    last_match_id = result.last_match_check_id; 

		    con.query('SELECT * FROM users WHERE interest = ? AND gender = ? AND id > ? ORDER BY id ASC', [req.session.gender, req.session.interest, last_match_id], function(error, results, fields) {

				if (results.length > 0) {
					
					var user = results[0];

					res.render(path.join(__dirname + '/../views/possibleMatch'), {
				        user: user
				    });

				} else {
					res.send('There are no more possible matches!');
				}			
				res.end();
			});
		    
		 });  


		
	}
};

exports.make_skip_match = function(req, res) {
   if(req.session.loggedin == true && req.session.email) {

   		var match_id = req.params.id;
   		var match_name = req.params.name;
   		var what_to_do = req.body.what_to_do;

		var current_user = null;

		function fetchID(callback) {
		   	con.query('SELECT * FROM users WHERE email = ?', [req.session.email], function(error, results, fields) {
				if (results.length > 0) {
					var current_user = results[0];
					return callback(current_user);
				} 		
			});
   		}

   		fetchID(function(user){  
		    current_user = user; 

		    //update last_match_check_id
   			con.query('UPDATE users SET last_match_check_id = ? WHERE email = ?', [match_id, req.session.email], function(error, results, fields) {});

	   		switch(what_to_do) {
	   			case 'match':

					//Check if Match
					   		function checkMatch(callback) { 
					   			con.query('SELECT * FROM matches WHERE ori_user_id = ? AND match_user_id = ?', [match_id, current_user.id], function(error, results, fields) {
									if (results.length > 0) {
										var match = results[0];
										
										return callback(match);
									} else {
										var match = 'no-match';
										return callback(match);
									}
								})
					   		}

					   		checkMatch(function(match) {
					   			if(match == 'no-match') {
					   				var sql = "INSERT INTO matches (ori_user_id, match_user_id, ori_user_name, match_user_name) VALUES (?, ?, ?, ?)";
									con.query(sql, [current_user.id, match_id, current_user.name, match_name], function (err, result) {
										console.log(err);
									});
					   			} else {
					   				con.query('UPDATE matches SET is_a_match = 1 WHERE ori_user_id = ? AND match_user_id = ?', [match_id, current_user.id], function(error, results, fields) {});
					   			}
					   		});

						res.redirect('/matches/get-more');
	   				break;

	   			default:
	   				res.redirect('/matches/get-more');
	   		}

		});
   		

   		
	}
};

exports.see_all_matches = function(req, res) {
   if(req.session.loggedin == true && req.session.email) {

   		var match_id = req.params.id;
   		var what_to_do = req.body.what_to_do;

		   	
		   	function getUser(callback) {
		   		con.query('SELECT * FROM users WHERE email = ?', [req.session.email], function(error, results, fields) {
					if (results.length > 0) {

						var current_user = results[0];
						return callback(current_user);

					} 		
				});
		   	}

		   	getUser(function(current_user) {
		   		con.query("SELECT * FROM matches WHERE (match_user_id = ? AND is_a_match = 1) OR (ori_user_id = ? AND is_a_match = 1)", [current_user.id, current_user.id], function(error, results, fields) {
					if (results.length > 0) {
						var matches = results;

						res.render(path.join(__dirname + '/../views/matches.ejs'), {
					        matches: matches,
					        user_name: current_user.name
					    });

					} 		
				}); 
		   	});


			  		

   		
	}
};