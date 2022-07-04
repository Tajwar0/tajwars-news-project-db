const express = require("express");
const app = express();
const { getTopics, getArticle } = require("./controllers/controller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

module.exports = app;
