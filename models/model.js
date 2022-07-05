const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

<<<<<<< HEAD
exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((article) => {
      return article.rows[0];
    });
};
// models/houses.js
=======
exports.updateArticle = (article_id, inc_votes) => {
  console.log("<----- 1");
  return db
    .query(
      `
      SELECT article
      SET votes = votes+ 2 
      WHERE article_id = 11
      RETURNING*;
    `
    )
    .then((updatedData) => {
      console.log("<----- 2");
      return updatedData.rows;
    });
};
>>>>>>> c9913e07a74aadc7ead91046aaf360238ac64cd6
