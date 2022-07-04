const { fetchTopics, selectArticleById } = require("../models/model");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.send(topics);
  });
};

exports.getArticle = (req, res) => {
  const { article_id } = req.params;
  selectArticleById(article_id).then((article) => {
    res.send(article);
  });
};
