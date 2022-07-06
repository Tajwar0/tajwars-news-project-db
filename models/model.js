const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.updateArticle = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({
      msg: "inc_votes is undefined",
      status: 400,
    });
  }
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
    .then((updatedArticle) => {
      if (updatedArticle.rowCount === 0) {
        return Promise.reject({
          msg: "article_id is not in database",
          status: 404,
        });
      }

      return updatedArticle.rows[0];
    });
};
