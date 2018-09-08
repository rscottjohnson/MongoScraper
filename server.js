ß// ==============================
// Dependencies
// ==============================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

// ==============================
// Scraping tools
// ==============================
var axios = require("axios");
var cheerio = require("cheerio");

// ==============================
// Models
// ==============================
var db = require("./models");

// ==============================
// Express setup
// ==============================
var PORT = process.env.Port || 3000;

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

// ==============================
// Mongo Database setup
// ==============================

// If deployed, use the deployed database. Otherwise use local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ==============================
// Handlebars setup
// ==============================

// Set Handlebars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
  defaultLayout: "main",
}));
app.set("view engine", "handlebars");

// ==============================
// Routes
// ==============================

// Scrape for new articles
app.get("/scrape", function (req, res) {
  // Grab the body of the html with request
  axios.get("http://www.reflector.com/News/").then(function (response) {
    // Load that into cheerio, save it to $ selector
    var $ = cheerio.load(response.data);
    var webPath = "www.reflector.com";

    $("div.content").each(function (i, element) {
      // Save an empty result object
      var result = {};

      result.title = $(this)
        .children("div.title")
        .children("a")
        .text();
      result.summary = $(this)
        .children("div.tease")
        .children("p")
        .text();
      result.link = webPath + $(this)
        .children("div.title")
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // Send a message if successful
    res.send("Scrape Complete");
  });
});

// Get all scraped articles from the db
app.get("/", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      var hbsObject = {
        article: dbArticle
      };
      res.render("home", hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Save an article that's been scraped
app.post("/save-article/:id", function (req, res) {

  var articleId = req.params.id;

  db.Article.findByIdAndUpdate(articleId, {
      saved: true
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Display saved articles
app.get("/saved", function (req, res) {
  db.Article.find({
      saved: true
    })
    .then(function (dbArticle) {
      var hbsObject = {
        article: dbArticle
      };
      res.render("saved", hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Add a note to a saved article
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({
      _id: req.params.id
    })
    .then(function (dbNote) {
      var hbsObject = {
        note: dbNote
      };
      res.render("notes-modal", hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Unsave an article that's been saved
app.post("/unsave-article/:id", function (req, res) {

  var articleId = req.params.id;

  db.Article.findByIdAndUpdate(articleId, {
      saved: false
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
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

app.delete("/articles/:id", function (req, res) {
  db.Note.findOneAndRemove({
      _id: req.params.id
    })
    .then(function (dbNote) {
      res.json(dbNote);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});