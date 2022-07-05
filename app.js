const express = require("express");
const app = express();
<<<<<<< HEAD
const { getTopics, getArticle } = require("./controllers/controller");

=======
const { getTopics, patchArticle } = require("./controllers/controller");
const {
  handleInvalidPaths,
  handlePsqlErrors,
  handleServerErrors,
} = require("./controllers/controller.error");
>>>>>>> c9913e07a74aadc7ead91046aaf360238ac64cd6
app.use(express.json());

app.get("/api/topics", getTopics);

<<<<<<< HEAD
app.get("/api/articles/:article_id", getArticle);
=======
app.patch("/api/articles/:article_id", patchArticle);

app.use("*", handleInvalidPaths);

app.use(handlePsqlErrors);

app.use(handleServerErrors);
>>>>>>> c9913e07a74aadc7ead91046aaf360238ac64cd6

module.exports = app;
