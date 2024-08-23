const jsonwebtoken = require("jsonwebtoken");
const db = require("../models/index");
const responses = require("./responses");

async function verityToken (req, res, next) {
  console.log("verifying user authorization forrr"+ req.url);
  console.log("dfgsg"+ req.headers.authorization);
  let result = null;
  try {
    if (req.header.authorization == null) {
      result = responses.badRequest("No token found in header");
    }
    // let token = req.headers.authorization;
    token = req.headers.authorization.split("Bearer ")[1];
    console.log("token "+token);

    if (jsonwebtoken.verify(token, "secret123")) {
      console.log("token verified successfully!!!");
      let payload = jsonwebtoken.decode(token);
      if (payload.exp >= Date.now()) {
        result = responses.unauthorized("Token has expired");
      } else {
        res.locals.user = payload;
        console.log(res.locals.user);
      }
    } else {
      console.log("not a valid token or unauthorized");
      result = responses.unauthorized("Not a valid token");
    }
    next(); 
  } catch (e) {
    result = responses.unauthorized(e);
    res.status(result.code).send(result);
  }
    
  
}
module.exports = verityToken;
