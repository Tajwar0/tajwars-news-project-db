const express = require("express");
const app = express();
const cors = require("cors");

const {
  getTopics,
  patchArticle,
  getArticle,
  getAllArticles,
  getUsers,
  postComment,
  getArticleComments,
  deleteComment,
  getApi,
} = require("./controllers/controller");

const {
  handleInvalidPaths,
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/controller.error");

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api", getApi);

app.use("*", handleInvalidPaths);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
