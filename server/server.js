var mysql = require('mysql');
var bodyParser = require("body-parser");
var express = require("express");
var session = require("express-session");
var path = require("path");

var app = express();

/* ROUTES */
app.get('/', function (request, response) {
    console.log('test');
});

app.listen(3000);