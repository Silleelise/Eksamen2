var mysql = require('mysql');
var bodyParser = require("body-parser");
var express = require("express");
var session = require("express-session");
var path = require("path");

var app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'Eksamen2',
    insecureAuth : true
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
  });

    /** 
     * ROUTES  
    **/

//Register Route
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/Users/silleeliselindskowhansen/Desktop/Eksamen2/view/register.html'));
});

//Login Route
app.get('/login', function (request, response) {
    response.sendFile(path.join(__dirname + '/Users/silleeliselindskowhansen/Desktop/Eksamen2/view/login.html'));
});

//Create user post
app.post('/register-user', function (request, response) {

    var username = request.body.username;
    var password = request.body.password;
    var email = request.body.email;
    var birthdate = request.body.birthdate;
    var gender = null;
    var interest = null;

    switch(request.body.gender) {
        case 'male':
            gender = 'male';
            break;
        case 'female':
            gender = 'female';
            break;
        default:
            gender = 'other';
    }

    switch(request.body.interest) {
        case 'male':
            interest = 'male';
            break;
        case 'female':
            interest = 'female';
            break;
        default:
            interest = 'other';
    }

    if(email && password) {
        var sql = "INSERT INTO eksamen.users (username, password, email, birthday, gender, interest) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(sql, [username, password, email, birthdate, gender, interest], function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
    }

  

    
});

app.listen(3000);
