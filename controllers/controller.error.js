exports.handleInvalidPaths = (req, res) => {
  res.status(404).send({ msg: "Invalid path" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid psql input" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};