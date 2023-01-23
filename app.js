const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articalSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articalSchema);

// request targeting all articles
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, articles) {
      if (err) {
        res.send(err);
      } else {
        res.send(articles);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    article.save(function (err) {
      if (!err) {
        res.send("article inserted successfully!!!");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted");
      } else {
        res.send(err);
      }
    });
  });

// request targeting specific articles

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, article) {
        if (article) {
          res.send(article);
        } else {
          res.send("No articles matching that title was found.");
        }
      }
    );
  })
  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content }
    );
  })
  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      req.body,
      function (err, docs) {
        if (!err) {
          res.send("Successfully update");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("delete succeed!!!");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started successfully");
});
