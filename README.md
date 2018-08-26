# MongoScraper
### A web app that lets users view and leave comments on the latest news
MongoScraper is a web app that scrapes news from another site, and lets users view and leave comments on the scraped articles.

## Motivation
MongoScraper is a one page app, which complies with the guidelines of:
* Using Node and Express for the web server
* Utilization of a MongoDB database and Mongoose
* Deployment on Heroku (with data)
* Use of the following six npm packages: express, express-handlebars, mongoose, body-parser, cheerio, and request.

## Project Usefulness
This web app is useful as a tool for allowing users who visit the site to view stories scraped from a news outlet, namely:
* The Headline title of the article
* The Summary of the article
* The URL for the original article

Users can also leave comments on the articles displayed and revisit them later.  These comments are saved to the database and associated with their articles.  These comments, which are visible to all users, can be deleted by the user later if they choose to do so.

## APIs / Libraries / Technology Used
The following APIs, libraries, and technology are used:

* npm - body-parser
* npm - express
* npm - express-handlebars
* npm - request
* npm - mongoose
* npm - cheerio

## Credits
MongoScraper was created by Scott Johnson.
