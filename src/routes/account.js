const accountController = require("../controllers/account.controller");
const verifyToken = require("../helpers/verify-token")

const accountRoute = require("express").Router();
accountRoute.post("/", accountController.signup);
accountRoute.post("/token", accountController.login);
accountRoute.get("/verify", verifyToken, accountController.verifyAccount);

module.exports = accountRoute;
 