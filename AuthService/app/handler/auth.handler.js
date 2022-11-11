const userRepository = require("../repository/user.repository")
const helper = require("../helpers/helper")
const winston = require("../helpers/winston.logger");
const jwt = require("../middleware/jwt.middleware");
const {body, check } = require("express-validator");

// VALIDATION
exports.validate = (method) => {
    switch (method) {
      case "login":
        return [
          body("password").not().isEmpty().withMessage("userName is required"),
          body('email').notEmpty().withMessage('email is required!').isEmail().withMessage("Invalid email format")
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
                code: helper.encryptText(user.id),
            })
        }else {
            // generate access token
            refreshToken = user.refresToken
        }

        let data = {
            name: user?.userName || "",
            email: emailAddress?.c_last_name || "",
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

exports.refreshToken = async(req, res) => {
    try {
        let response = {}
        const body = req.body

        const save = await userRepository.createUser({emailAddress: body.emailAddress, userName:body.userName, accountNumber: body.accountNumber})

        response = helper.createResponse(201, "Created", [], save)
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

exports.logout = async(req, res) => {
    try {
        let response = {}
        const body = req.body
        const { id } = req.params

        const user = await userRepository.findById(id)
        if (!user){
            result = helper.createResponse(404, "Not Found", "User Not Found")
            winston.logger.warn(
                `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
            );
            return res.status(404).json(result)
        }

        const save = await userRepository.udpateUser(id, {emailAddress: body.emailAddress, userName:body.userName, accountNumber: body.accountNumber})

        response = helper.createResponse(201, "OK", [], "Data upated succesfully")

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