const articles = require("../db/data/test-data/articles");
const {
  fetchTopics,
  selectArticleById,
  updateArticle,
} = require("../models/model");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (article_id < articles.length) {
        res.status(200).send(article);
      } else if (article_id >= articles.length) {
        res.status(404).send({ msg: "article_id does not exist in database" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticle(article_id, inc_votes)
    .then((updatedData) => {
      res.status(201).send(updatedData);
    })
    .catch((err) => {
      next(err);
    });
};
