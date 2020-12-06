var path = require("path");
var config = require("../databasemysql.js");
var con = config.connection;

// Viser liste over alle brugere der er oprettet i mysqql
exports.show_possible_match = function (req, res) {
  if (req.session.loggedin == true && req.session.email) {
    //Hvis bruger er logget ind, fetches
    function fetchID(callback) {
      con.query(
        "SELECT * FROM users WHERE email = ?",
        [req.session.email],
        function (error, results, fields) {
          if (results.length > 0) {
            var user = results[0];
            return callback(user);
          }
        }
      );
    }

    var last_match_id = 0;

    //Itererer igennem brugerne i systemet
    fetchID(function (result) {
      last_match_id = result.last_match_check_id;

      con.query(
        "SELECT * FROM users WHERE interest = ? AND gender = ? AND id > ? ORDER BY id ASC",
        [req.session.gender, req.session.interest, last_match_id],
        function (error, results, fields) {
          if (results.length > 0) {
            var user = results[0];
            res.render(path.join(__dirname + "/../views/potentialmatch"), {
              user: user,
            });
          } else {
            res.send("There are no more users to match with!"); //Når der ikke er flere opretterede brugere i mysql
          }
          res.end();
        }
      );
    });
  }
};
//dislike function
exports.make_dislike_match = function (req, res) {
  if (req.session.loggedin == true && req.session.email) {
    var match_id = req.params.id;
    var match_name = req.params.name;
    var what_to_do = req.body.what_to_do;

    var current_user = null;

    function fetchID(callback) {
      con.query(
        "SELECT * FROM users WHERE email = ?",
        [req.session.email],
        function (error, results, fields) {
          if (results.length > 0) {
            var current_user = results[0];
            return callback(current_user);
          }
        }
      );
    }

    fetchID(function (user) {
      current_user = user;

      //Opdaterer last_match_check_id i mysql users table
      con.query(
        "UPDATE users SET last_match_check_id = ? WHERE email = ?",
        [match_id, req.session.email],
        function (error, results, fields) {}
      );

      switch (what_to_do) {
        case "match":
          //Check if Match
          function checkMatch(callback) {
            con.query(
              "SELECT * FROM matches WHERE first_user_id = ? AND second_user_id = ?",
              [match_id, current_user.id],
              function (error, results, fields) {
                if (results.length > 0) {
                  var match = results[0];
                  console.log("Its a match");

                  return callback(match);
                } else {
                  var match = "no-match";
                  return callback(match);
                }
              }
            );
          }

          checkMatch(function (match) {
            if (match == "no-match") {
              var sql =
                "INSERT INTO matches (first_user_id, second_user_id, first_user_name, second_user_name) VALUES (?, ?, ?, ?)";
              con.query(
                sql,
                [current_user.id, match_id, current_user.name, match_name],
                function (error, result) {
                  console.log(error);
                }
              );
            } else {
              con.query(
                "UPDATE matches SET is_a_match = 1 WHERE first_user_id = ? AND second_user_id = ?",
                [match_id, current_user.id],
                function (error, results, fields) {}
              );
            }
          });

          res.redirect("/yourmatches/morematches");
          break;

        default:
          res.redirect("/yourmatches/morematches");
      }
    });
  }
};

//Se alle matches
exports.see_all_matches = function (req, res) {
  if (req.session.loggedin == true && req.session.email) {
    var match_id = req.params.id;
    var what_to_do = req.body.what_to_do;

    function getUser(callback) {
      con.query(
        "SELECT * FROM users WHERE email = ?",
        [req.session.email],
        function (error, results, fields) {
          if (results.length > 0) {
            var current_user = results[0];
            return callback(current_user);
          }
        }
      );
    }

    getUser(function (current_user) {
      con.query(
        "SELECT * FROM matches WHERE (second_user_id = ? AND is_a_match = 1) OR (first_user_id = ? AND is_a_match = 1)",
        [current_user.id, current_user.id],
        function (error, results, fields) {
          if (results.length > 0) {
            var matches = results;

            res.render(path.join(__dirname + "/../views/matches.ejs"), {
              matches: matches,
              user_name: current_user.name,
              match_deleted: req.params.deleted,
            });
          } else {
            res.send("No matches.");
          }
          res.end();
        }
      );
    });
  }
};

exports.delete_match = function (req, res) {
  if (req.session.loggedin == true && req.session.email) {
    //con.query("SELECT * FROM matches WHERE (second_user_id = ? AND is_a_match = 1) OR (first_user_id = ? AND is_a_match = 1)", [current_user.id, current_user.id], function(error, results, fields) {
    con.query(
      "DELETE FROM matches WHERE id = ?",
      [req.body.match_id],
      (error, results, fields) => {
        console.log(error); // Handle error
        res.redirect("/yourmatches/true");
      }
    );
  }
};
