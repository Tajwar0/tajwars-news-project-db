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
