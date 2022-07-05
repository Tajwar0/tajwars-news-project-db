const articles = require("../db/data/test-data/articles");

exports.handleInvalidPaths = (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
};

exports.handleNonExistentIds = (err, req, res, next) => {
  const { article_id } = req.params;
  if (articles.length < article_id) {
    res
      .status(404)
      .send({ msg: "article_id does not exist in current articles" });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
