var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');

var allRoutes = require('./routes/web');



var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');



app.use('/', allRoutes);

app.listen(3500);

module.exports = app;

