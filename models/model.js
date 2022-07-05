const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((article) => {
      return article.rows[0];
    });
};
// models/houses.js
exports.updateArticle = (article_id, inc_votes) => {
  console.log("<----- 1");
  return db
    .query(
      `
      SELECT article
      SET votes = votes+ $1 
      WHERE article_id = $2
      RETURNING*;
    `,
      [inc_votes, article_id]
    )
    .then((updatedData) => {
      console.log("<----- 2");
      return updatedData.rows;
    });
};
