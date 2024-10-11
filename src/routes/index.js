const verityToken = require("../helpers/verify-token");
const accountRoute = require("./account");
const securedRoute = require("./secure");
const vasController = require("../controllers/vas.controller");

const indexRoute = require("express").Router();

/* GET home page. */
// indexRoute.get("/*", verityToken);
indexRoute.use("/api/v1/account", accountRoute);
indexRoute.use("/api/v18", verityToken, securedRoute);

indexRoute.get("/", function (req, res, next) {
  res.send("welcome to sodiq app");
  return;
});

module.exports = indexRoute;
