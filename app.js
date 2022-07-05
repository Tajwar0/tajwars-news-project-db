const express = require("express");
const app = express();
const { getTopics, patchArticle } = require("./controllers/controller");
const {
  handleInvalidPaths,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/controller.error");
app.use(express.json());

app.get("/api/topics", getTopics);

app.patch("/api/articles/:article_id", patchArticle);

app.use("*", handleInvalidPaths);

app.use(handlePsqlErrors);

app.use(handleServerErrors);

module.exports = app;
