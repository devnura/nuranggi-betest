const userRepository = require("../repository/user.repository")
const helper = require("../helpers/helper")
const winston = require("../helpers/winston.logger");
const jwt = require("../middleware/jwt.middleware");
const {body, check } = require("express-validator");
const bcrypt = require("bcrypt");

// VALIDATION
exports.validate = (method) => {
    switch (method) {
      case "login":
        return [
          body("password").not().isEmpty().withMessage("password is required"),
          body('email').notEmpty().withMessage('email is required!').isEmail().withMessage("Invalid email format")
          .isLength({
              max: 64
          }).withMessage('email is out of length!')
        ];
      case "register":
        return [
          body("password").notEmpty().withMessage("password is required"),
          body("userName").notEmpty().withMessage("userName is required"),
          body('emailAddress').notEmpty().withMessage('emailAddress is required!').isEmail().withMessage("Invalid email format")
          .isLength({
              max: 64
          }).withMessage('email is out of length!')
        ];
    case "refreshToken":
        return [
            body("refresh_token").notEmpty().withMessage('refresh_token is required!')
        ]
      default:
        break;
    }
  };

exports.loginUser = async (req, res) => {
    try {
        let response = {}

        const { email, password } = req.body
        let accessToken, refreshToken

        const user = await userRepository.findByEmail(email)
        if (!user){
            result = helper.createResponse(401, "Unauthorized", "Invalid Email or password !")
            // log info
            winston.logger.warn(
                `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(response)}`
            );
            return res.status(401).json(result)
        }

        // check password
        let checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
    
            result = helper.createResponse(401, "UNAUTHORIZED", "Invalid email or password", []);
    
            // log warn
            winston.logger.warn(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
            );
    
            return res.status(401).json(result);
        }

        // generate access token
        accessToken = jwt.generateAccessToken({
            id: helper.encryptText(user.id),
            userName: helper.encryptText(user.userName)
        })

        if(!user.refresToken){
            // generate refresh token
            refreshToken = jwt.generateRefreshToken({
                id: helper.encryptText(user.id),
            })
        }else {
            // generate access token
            refreshToken = user.refresToken
        }

        let data = {
            name: user?.userName || "",
            email: user?.emailAddress || "",
            access_token: accessToken,
            refresh_token: refreshToken,
          }


        response = helper.createResponse(200, "Ok", [], data)
        // log info
        winston.logger.info(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(response)}`
        );
        return res.status(200).json(response)

    } catch (error) {
        result = helper.createResponse(500, "Internal Server Error", error.message)
        winston.logger.error(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
        );
        return res.status(500).json(result)
    }
}

exports.register = async(req, res) => {
    try {
        let response = {}
        const body = req.body
        // chcek email
        const email = await userRepository.findByEmail(body.emailAddress)
        if(email) {
            result = helper.createResponse(400, "Bad Request", "Email already used !")
            // log info
            winston.logger.warn(
                `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(response)}`
            );
            return res.status(400).json(result)
        }

        const saltRounds = 10;
        let salt = bcrypt.genSaltSync(saltRounds);
        let passwordHash = bcrypt.hashSync(body.password, salt)

        const save = await userRepository.createUser({userName : body.userName, emailAddress: body.emailAddress, password :passwordHash})

        response = helper.createResponse(201, "Created")
        // log info
        winston.logger.info(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(response)}`
        );

        return res.status(201).json(response)

    } catch (error) {
        result = helper.createResponse(500, "Internal Server Error", error.message)
        winston.logger.error(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
            );
        return res.status(500).json(result)
    }
}

exports.refresToken = async(req, res) => {
    try {
        let response = {}
        const body = req.body
        const user = await userRepository.findById(req.id)
        let accessToken, refreshToken

        if (!user){
            result = helper.createResponse(404, "Not Found", "User Not Found")
            winston.logger.warn(
                `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
            );
            return res.status(404).json(result)
        }

        // generate access token
        accessToken = jwt.generateAccessToken({
            id: helper.encryptText(user.id),
            userName: helper.encryptText(user.userName)
        })

        // generate refresh token
        refreshToken = jwt.generateRefreshToken({
            id: helper.encryptText(user.id),
        })

        const save = await userRepository.udpateUser(user.id, {refresToken: body.emailAddress})

        let data = {
            name: user?.userName || "",
            email: user?.emailAddress || "",
            access_token: accessToken,
            refresh_token: refreshToken,
          }


        response = helper.createResponse(200, "Ok", [], data)
        // log info
        winston.logger.info(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(response)}`
        );
        return res.status(200).json(response)

    } catch (error) {
        console.log(error.message)
        result = helper.createResponse(500, "Internal Server Error", error.message)
        winston.logger.error(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
            );
        return res.status(500).json(result)
    }
}

exports.validateToken = async (req, res) => {
    return res.status(200).json({})
}

exports.logout = async(req, res) => {
    try {
        let response = {}
        const user = await userRepository.findById(req.id)
        if (!user){
            result = helper.createResponse(404, "Not Found", "Invalid login session")
            winston.logger.warn(
                `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
            );
            return res.status(404).json(result)
        }

        const save = await userRepository.udpateUser(user.id, {refresToken: ""})

        response = helper.createResponse(200, "Ok", [])
        // log info
        winston.logger.info(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(response)}`
        );
        return res.status(200).json(response)

    } catch (error) {
        console.log(error.message)
        result = helper.createResponse(500, "Internal Server Error", error.message)
        winston.logger.error(
            `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
            );
        return res.status(500).json(result)
    }
}