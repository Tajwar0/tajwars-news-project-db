const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.article_id)AS int) AS comment_count FROM articles 
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id;
      `,
      [article_id]
    )
    .then((article) => {
      if (article.rowCount === 0) {
        return Promise.reject({
          msg: "article_id is not in database",
          status: 404,
        });
      }
      return article.rows[0];
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
      `UPDATE articles SET votes = votes+ $1 WHERE article_id = $2 RETURNING*;`,
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

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.article_id)AS int) AS comment_count FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY created_at DESC;`
    )
    .then((allArticles) => {
      return allArticles.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then((users) => {
    return users.rows;
  });
};

exports.createComment = (requestBody, article_id) => {
  const { username, body } = requestBody;
  if (article_id < 0 || article_id >= articles.length) {
    return Promise.reject({
      msg: "article_id is not in database",
      status: 404,
    });
  }
  if (username === undefined || body === undefined) {
    return Promise.reject({
      msg: "bad user post input",
      status: 400,
    });
  }

  return db
    .query(
      `INSERT INTO comments (body,  author, article_id) VALUES ($1, $2, $3) RETURNING*`,
      [body, username, article_id]
    )
    .then((createdComment) => {
      return createdComment.rows[0];
    });
};
