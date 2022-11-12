const jwt = require("jsonwebtoken");
const helper = require("../helpers/helper");

const generateRefreshToken = (req) => {
  let expiresIn = process.env.JWT_REFRESH_EXPIRATION ? process.env.JWT_REFRESH_EXPIRATION : "7d";
  let signOptions = {
    issuer: 'NURANGGIBETEST',
    expiresIn: expiresIn,
  }
  return jwt.sign(req, process.env.REFRESH_TOKEN_SECRET, signOptions);
};

const authenticateRefreshToken = (req, res, next) => {

  let { refresh_token } = req.body

  if(!refresh_token){
    let result = helper.createResponse(400, "Internal Server Error", "Refresh Token is required !")
    return res.status(400).json(result);
  }

  let verifyOptions = {
    issuer: 'NURANGGIBETEST',
  }

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, verifyOptions, (err, data) => {
    if (err) {
      let result = helper.createResponse(400, "Internal Server Error", err.message)
      return res.status(400).json(result);
    }

    req.id = helper.decryptText(data.id)

    next();

  });
};

const generateAccessToken = (req) => {
  let expiresIn = process.env.JWT_EXPIRATION ? process.env.JWT_EXPIRATION : "1h";
  let signOptions = {
    issuer: 'NURANGGIBETEST',
    expiresIn: expiresIn,
  }
  return jwt.sign(req, process.env.TOKEN_SECRET, signOptions);
};

const authenticateToken = (req, res, next) => {
  let authHeader = req.headers["authorization"];

  if (authHeader) {
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.json({
        code: "401",
        message: "Token is required",
        data: {},
      });
    }

    let verifyOptions = {
      issuer: 'NURANGGIBETEST',
    }

    jwt.verify(token, process.env.TOKEN_SECRET, verifyOptions, (err, data) => {
      if (err) {
        let result = helper.createResponse(402, "Bad Request", err.message)
        return res.status(402).json(result);
      }

      req.id = helper.decryptText(data.id);
      req.userName = helper.decryptText(data.userName);
      req.isAuthorization = true

      next();
    });
  } else {
    let result = helper.createResponse(400, "Bad Request", "Header not found")
    return res.status(400).json(result);
  }
};

const isAuthenticate = (req, res, next) => {
  if (req.headers.isauthenticate == "true") {
      next();
  } else {
    let result = helper.createResponse(403, "Forbidden")
    return res.status(403).json(result);
  }
};

module.exports = {
  generateRefreshToken,
  authenticateRefreshToken,
  generateAccessToken,
  authenticateToken,
  isAuthenticate
};
