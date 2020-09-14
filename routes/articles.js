const express = require("express");
const Article = require("./../models/article.model");
const router = express.Router();

router.get("/new", function (req, res) {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async function (req, res) {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

//create article
router.post("/", async function (req, res) {
  let article = new Article({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    article = await article.save();
    res.redirect(`/articles/${article.slug}`);
  } catch (err) {
    res.render("articles/new", { article: article });
  }
});

router.get("/:slug", async function (req, res) {
  try {
    let article = await Article.findOne({ slug: req.params.slug });
    res.render("articles/show", { article: article });
  } catch (err) {
    res.redirect("/");
  }
});

//delete article
router.delete("/:id", async function (req, res) {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

//update article
router.post(
  "/",
  async function (req, res, next) {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  async function (req, res, next) {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

function saveArticleAndRedirect(path) {
  return async function (req, res) {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      res.render(`articles/${patch}`, { article: article });
    }
  };
}

module.exports = router;
