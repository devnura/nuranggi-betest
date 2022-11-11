const userRepository = require("../repository/user.repository")
const helper = require("../helpers/helper")
const winston = require("../helpers/winston.logger");

const { param, body, check } = require("express-validator");

// VALIDATION
exports.validate = (method) => {
    switch (method) {
      case "create":
        return [
          body("userName").not().isEmpty().withMessage("userName is required"),
          body("accountNumber").isNumeric().withMessage("accountNumber must number").not().isEmpty().withMessage("accountNumber is required"),
          body('emailAddress').notEmpty().withMessage('emailAddress is required!').isEmail().withMessage("Invalid emailAddress format")
          .isLength({
              max: 64
          }).withMessage('emailAddress is out of length!')
        ];
        case "update":
            return [
              check("id").notEmpty().withMessage('id is required!').isLength({
                max: 24,
                min : 24
                }),
              body("userName").not().isEmpty().withMessage("userName is required"),
              body("accountNumber").isNumeric().withMessage("accountNumber must number").not().isEmpty().withMessage("accountNumber is required"),
              body('emailAddress').notEmpty().withMessage('emailAddress is required!').isEmail().withMessage("Invalid emailAddress format")
              .isLength({
                  max: 64
              }).withMessage('emailAddress is out of length!')
        ];
        case "checkId":
            return [
                check("id").notEmpty().withMessage('id is required!').isLength({
                    max: 24,
                    min : 24
                    }).withMessage('id mush 24 character lenght!')
        ];
      default:
        break;
    }
  };

exports.fetchAll = async(req, res) => {
    try {
        const uniqueCode = req.requestId;

        let response = {}

        const params = {
            page: req.query.page || 1,
            limit: req.query.limit || 10,
        }

        let page = params.page || 1;
        if (page < 1) page = 1;
        let offset = (page - 1) * params.limit;

        const user = await userRepository.fetchAll(params.limit, offset)

        let result = helper.generatePaginate(user.count, user.rows, page, params.limit, offset)

        response = helper.createResponse(200, "Ok", [], result)

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

exports.findById = async (req, res) => {
    try {
        let response = {}

        const { id } = req.params

        const user = await userRepository.findById(id)
        if (!user){
            result = helper.createResponse(404, "Not Found", "User Not Found")
            // log info
            winston.logger.warn(
                `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(response)}`
            );
            return res.status(404).json(result)
        }
        response = helper.createResponse(200, "Ok", [], user)
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

exports.createUser = async(req, res) => {
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

exports.updateUser = async(req, res) => {
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

exports.deleteUser = async(req, res) => {
    try {
        let response = {}
        const { id } = req.params

        const user = await userRepository.findById(id)
        if (!user){
            result = helper.createResponse(404, "Not Found", "User Not Found")
            winston.logger.warn(
                `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
            );
            return res.status(404).json(result)
        }

        const deleteUser = await userRepository.deleteUser(id)

        response = helper.createResponse(201, "OK", "Data deleted succesfuly")
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