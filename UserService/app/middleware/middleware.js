const helper = require('../helpers/helper')
exports.isAuthenticate = (req, res, next) => {
    if (req?.isAuthenticate == true) {
        next();
    } else {
      let result = helper.createResponse(403, "Forbidden")
      return res.status(403).json(result);
    }
  };