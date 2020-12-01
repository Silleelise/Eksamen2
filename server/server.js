var mysql = require("mysql");
var bodyParser = require("body-parser");
var express = require("express");
var session = require("express-session");
var path = require("path");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function generateAccessToken(user_id) {
  return jwt.sign(user_id, process.env.TOKEN_SECRET);
}

function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user_id) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user_id = user_id;
    next(); // pass the execution off to whatever request the client intended
  });
}

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "Eksamen2",
  insecureAuth: true,
});

connection.connect(function (err) {
  if (err) {
    return console.error("error: " + err.message);
  }
  console.log("Connected to the MySQL server.");
});

/**
 * ROUTES
 **/

//Register Route
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname + "/../view/register.html"));
});

//Login Route
app.get("/login", function (request, response) {
  response.sendFile(path.join(__dirname + "/../view/login.html"));
});

//Create user post
app.post("/register-user", function (request, response) {
  var username = request.body.username;
  var password = request.body.password;
  var email = request.body.email;
  var birthdate = request.body.birthdate;
  var gender = null;
  var interest = null;

  switch (request.body.gender) {
    case "male":
      gender = "male";
      break;
    case "female":
      gender = "female";
      break;
    default:
      gender = "other";
  }

  switch (request.body.interest) {
    case "male":
      interest = "male";
      break;
    case "female":
      interest = "female";
      break;
    default:
      interest = "other";
  }

  if (email && password) {
    var sql =
      "INSERT INTO eksamen.users (username, password, email, birthday, gender, interest, _ID) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const newId = uuidv4();
    const newToken = generateAccessToken(newId);

    connection.query(
      sql,
      [username, password, email, birthdate, gender, interest, newId],
      function (err, result) {
        if (err) throw err;
        console.log("success");
      }
    );
    return response.json({
      token: newToken,
      user_id: newId,
    });
  }
});

app.listen(3000);
console.log("Server started...");
