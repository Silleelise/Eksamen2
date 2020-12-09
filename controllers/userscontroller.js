var path = require("path");
var config = require("../databasemysql.js");
var con = config.connection;

//Display list of all users.
exports.user_list_potential_matches = function (req, res) {
  res.send("NOT IMPLEMENTED: user potential matches list");
};

// Viser profil for en specifik bruger
exports.user_detail = function (req, res) {
  if (req.session.loggedin && req.session.email) {
    //Tjekker session
    con.query(
      "SELECT * FROM users WHERE email = ?",
      [req.session.email],
      function (error, results, fields) {
        if (results.length > 0) {
          var user = results[0];
          req.session.gender = user.gender;
          req.session.interest = user.interest;

          res.render(path.join(__dirname + "/../views/profile.ejs"), {
            user: user,
          });
        } else {
          res.send("User does not exist!");
        }
        res.end();
      }
    );
  }
};

// Display user create form on GET.
exports.user_create_get = function (req, res) {
  res.sendFile(path.join(__dirname + "/../views/register.html"));
};

// Registrerer user med attributter
exports.user_create_post = function (req, res) {
  //exporterers fra routes
  var name = req.body.name; //definenrer værdier
  var gender = req.body.gender;
  var interest = req.body.interest;
  var email = req.body.email;
  var password = req.body.password;

  //kontrollerer at du er logget ind og opdaterer SQL
  if (email && password) {
    var sql =
      "INSERT INTO users (name, gender, interest, email, password) VALUES (?, ?, ?, ?, ?)";
    con.query(
      sql,
      [name, gender, interest, email, password],
      function (error, result) {
        //er defineret oven over
        if (error) {
          throw error; //hvis email ikke er unik og eksisterer i databasesn kastes fejl
        } else {
          req.session.loggedin = true; //ellers hvis email er unik starter session og du logges ind og redirectes til siden /profile
          req.session.email = email;
          res.redirect("/profile");
        }
      }
    );
  } else {
    //hvis alle attributter ikke er opfyldt i registreringsform
    res.send("Please fill out form!");
    res.end();
  }
};

//isplay user delete form on GET.
exports.user_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: user delete GET");
};

// Handle user delete on POST.
exports.user_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: user delete POST");
};

// Display user update form on GET.
exports.user_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: user update GET");
};

// Handle user update on POST.
exports.user_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: user update POST");
};
