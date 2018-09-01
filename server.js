// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Models
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");
// var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Morgan logger for logging requests
app.use(logger("dev"));
// Body-parser for handling form submissions
app.use(bodyParser.urlencoded({
  extended: true
}));
// Express.static to serve public folder as static directory
app.use(express.static("public"));

// Mongo DB connecion
// If deployed, use the deployed database. Otherwise use local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  partialsDir: path.join(__dirname, "views/layouts/partials")
}));
app.set("view engine", "handlebars");

// Routes

// GET route for scraping the chosen website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("http://www.reflector.com/News/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Grab artisles and do the following:
    $("div.content").each(function (i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("div.title")
        .children("a")
        .text();
      result.summary = $(this)
        .children("div.tease")
        .children("p")
        .text();
      result.link = $(this)
        .children("div.title")
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({
      _id: req.params.id
    })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/",function(req, res) {
  Article.find({"saved": false}, function(error, data) {
    var hbsObject = {
      articles: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});