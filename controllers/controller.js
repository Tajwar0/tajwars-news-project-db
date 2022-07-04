const { fetchTopics } = require("../models/model");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.send(topics);
  });
};
