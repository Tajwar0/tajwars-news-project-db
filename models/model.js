const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.updateArticle = (article_id, body) => {
  const voteIncrement = body.inc_votes;
  g;
};
