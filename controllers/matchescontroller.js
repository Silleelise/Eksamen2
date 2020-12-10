var path = require("path");
var config = require("../databasemysql.js");
var con = config.connection;

// Brugere der er oprettet i på sitet og dermed også i MySQL databasen
exports.show_potential_match = function (req, res) {
  if (req.session.loggedin == true && req.session.email) {
    //er logget ind med session
    //Hvis bruger er logget ind, fetches callback
    function fetchID(callback) {
      con.query(
        "SELECT * FROM users WHERE email = ?", //på baggrund af brugerens emailen der er unik fra databasen
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

    //Går igennem brugerne i systemet
    fetchID(function (result) {
      last_match_id = result.last_interaktion_id;

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
//Dislike funktion når to brugere 'mødes'
exports.make_dislike_match = function (req, res) {
  if (req.session.loggedin == true && req.session.email) {
    //er logget ind med session
    var match_id = req.params.id;
    var match_name = req.params.name;
    var like_or_dislike = req.body.like_or_dislike;
    var current_user = null;
    function fetchID(callback) {
      con.query(
        "SELECT * FROM users WHERE email = ?", //på baggrund af brugerens emailen der er unik fra databasen
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

      //Opdaterer last_interaktion_id i MySQL users table, altså id'et på den sidste bruger vedkommende har 'mødt', liket eller disliket
      con.query(
        "UPDATE users SET last_interaktion_id = ? WHERE email = ?",
        [match_id, req.session.email],
        function (error, results, fields) {}
      );

      switch (like_or_dislike) {
        case "match":
          //Tjekker om der er et match
          function checkMatch(callback) {
            con.query(
              "SELECT * FROM matches WHERE first_user_id = ? AND second_user_id = ?", //finder de to brugeres id i MySQL
              [match_id, current_user.id],
              function (error, results, fields) {
                if (results.length > 0) {
                  var match = results[0]; //liket tilbage = match
                  console.log("Its a match");
                  return callback(match);
                } else {
                  var match = "not_a_match"; //ikke liket tilbage =not_a_match
                  return callback(match);
                }
              }
            );
          }

          checkMatch(function (match) {
            if (match == "not_a_match") {
              var sql =
                "INSERT INTO matches (first_user_id, second_user_id, first_user_name, second_user_name) VALUES (?, ?, ?, ?)";
              con.query(
                sql,
                [current_user.id, match_id, current_user.name, match_name],
                function (error, result) {
                  console.log(error); //Hvis der allerede er et like fra den anden bruger mod vedkommende som er logget, opdateres deres allerede eksisterende 'match' (møde) med match fra 0 til 1
                }
              );
            } else {
              con.query(
                "UPDATE matches SET match = 1 WHERE first_user_id = ? AND second_user_id = ?",
                [match_id, current_user.id],
                function (error, results, fields) {} //Hvis der ikke er et like fra den bruger til vedkommende som er logget ind, så skal der oprettes et match (møde) i mySQL
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

//Se alle matches funktion
exports.see_all_matches = function (req, res) {
  if (req.session.loggedin == true && req.session.email) {
    //er logget ind
    var match_id = req.params.id;
    var like_or_dislike = req.body.like_or_dislike;

    function getUser(callback) {
      con.query(
        "SELECT * FROM users WHERE email = ?", //på baggrund af brugerens emailen der er unik fra databasen
        [req.session.email],
        function (error, results, fields) {
          if (results.length > 0) {
            //hvis der er matches
            var current_user = results[0];
            return callback(current_user);
          }
        }
      );
    }

    //Viser matches
    getUser(function (current_user) {
      //funktion der tager variablen fra ovenstående ind
      con.query(
        "SELECT * FROM matches WHERE (second_user_id = ? AND match = 1) OR (first_user_id = ? AND match = 1)", //henter data fra MySQL matches tabel på netop den person som har liket en tilbage
        [current_user.id, current_user.id],
        function (error, results, fields) {
          if (results.length > 0) {
            //hvis brugeren har matches, nogle har liket brugeren tilbage
            var matches = results;

            res.render(path.join(__dirname + "/../views/matches.ejs"), {
              //siden viser de matches brugeren har
              matches: matches,
              user_name: current_user.name,
              match_deleted: req.params.deleted,
            });
          } else {
            res.send("You dont have any matches :("); //hvis brugeren ikke har matches
          }
          res.end();
        }
      );
    });
  }
};
//sletter match
exports.delete_match = function (req, res) {
  if (req.session.loggedin == true && req.session.email) {
    //er logget ind
    con.query(
      "DELETE FROM matches WHERE id = ?", //på baggrund af id i matches tabellen i MySQL
      [req.body.match_id],
      (error, results, fields) => {
        console.log(error); // Håndterer error
        res.redirect("/yourmatches/true"); //redirectes til samme side /yourmatches
      }
    );
  }
};
