const express = require("express");
const app = express();
const { getTopics, patchArticle } = require("./controllers/controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.patch("/api/articles/:article_id", patchArticle);
module.exports = app;
