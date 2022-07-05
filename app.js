const express = require("express");
const app = express();
const {
  getTopics,
  patchArticle,
  getArticle,
} = require("./controllers/controller");
const {
  handleInvalidPaths,
  handlePsqlErrors,
  handleServerErrors,
  handleNonExistentIds,
} = require("./controllers/controller.error");
app.use(express.json());
app.get("/api/articles/:article_id", handleNonExistentIds);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.patch("/api/articles/:article_id", patchArticle);

app.use("*", handleInvalidPaths);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
