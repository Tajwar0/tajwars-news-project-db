const { fetchTopics, updateArticle } = require("../models/model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  console.log("<----- 3");
  updateArticle(article_id, inc_votes)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticle = (req, res) => {
  const { article_id } = req.params;
  selectArticleById(article_id).then((article) => {
    res.send(article);
  });
};
