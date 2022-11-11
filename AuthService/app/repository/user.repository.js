const userModel = require("../model/user.model")

exports.findByEmail = async (email) => {
    const rows = await userModel.findOne({ emailAddress: email }).exec()

    return rows
}