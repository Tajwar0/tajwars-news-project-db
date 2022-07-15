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

exports.fetchAllArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic = undefined
) => {
  const validSortBy = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "comment_count",
    "article_id",
  ];
  const validOrder = ["ASC", "asc", "DESC", "desc"];
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid user input: sort_by value`,
    });
  }

  if (!validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: `Invalid user input: order value`,
    });
  }

  if (topic === undefined) {
    return db
      .query(
        `SELECT articles.*, CAST(COUNT(comments.article_id)AS int) AS comment_count FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY articles.${sort_by} ${order};`
      )
      .then((allArticles) => {
        return allArticles.rows;
      });
  }
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.article_id)AS int) AS comment_count FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.topic = '${topic}'
        GROUP BY articles.article_id
        ORDER BY articles.${sort_by} ${order};`
    )
    .then((allArticles) => {
      if (allArticles.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: `Invalid topic`,
        });
      }
      return allArticles.rows;
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

exports.fetchArticleComments = (article_id) => {
  if (article_id < -1 || article_id >= articles.length) {
    return Promise.reject({
      msg: "article_id is not in database",
      status: 404,
    });
  }
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1`,
      [article_id]
    )
    .then((articleComments) => {
      return articleComments.rows;
    });
};
