const vasRoute = require("./vas");

const securedRoute = require("express").Router();

securedRoute.use("/vas", vasRoute);

module.exports = securedRoute;
