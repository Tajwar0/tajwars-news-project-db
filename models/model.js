const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.updateArticle = (article_id, inc_votes) => {
  console.log("<----- 1");
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING*;
    `,
      [inc_votes, article_id]
    )
    .then((updatedData) => {
      console.log("<----- 2");
      return updatedData.rows[0];
    });
};
