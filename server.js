const express = require("express"); //require express framework
const server = express();
const session = require("express-session"); //require express-sessions til cookies
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const allRoutes = require("./routes/app"); 

//Session cookie
server.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(express.static(__dirname + "/views")); //billede kan kun ligge i views
server.set("view engine", "ejs");

server.use("/", allRoutes);

server.listen(3500); //Lytter på port 3500

module.exports = server;
