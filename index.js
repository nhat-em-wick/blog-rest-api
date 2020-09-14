require("dotenv/config");
const express = require("express");
const app = express();
var methodOverride = require("method-override");
const Article = require("./models/article.model");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const articleRoute = require("./routes/articles");

const port = 3600;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  let articles = await Article.find().sort({ date: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRoute);

mongoose.connect(process.env.DB_CONNECTION, function () {
  console.log("connected mongodb");
});

app.listen(port, function () {
  console.log("listening on port " + port);
});
