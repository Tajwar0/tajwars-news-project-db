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
    .then((updatedData) => {
      res.status(201).send(updatedData);
    })
    .catch((err) => {
      next(err);
    });
};
