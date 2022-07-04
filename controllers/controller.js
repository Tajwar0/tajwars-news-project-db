const { fetchTopics, updateArticle } = require("../models/model");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.send(topics);
  });
};

exports.patchArticle = (req, res) => {
  const { article_id } = req.params;
  updateArticle(article_id, req.body)
    .then((updatedArticle) => {
      res.status(201).send(updatedArticle);
    })
    .catch((err) => {
      console.log(err);
    });
};
