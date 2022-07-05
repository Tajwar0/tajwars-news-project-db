<<<<<<< HEAD
const { fetchTopics, selectArticleById } = require("../models/model");
=======
const { fetchTopics, updateArticle } = require("../models/model");
>>>>>>> c9913e07a74aadc7ead91046aaf360238ac64cd6

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
    .then((updatedData) => {
      res.status(201).send(updatedData);
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
