const userModel = require("../model/user.model")

exports.findByEmail = async (email) => {
    const rows = await userModel.findOne({ emailAddress: email }).exec()

    return rows
}

exports.findById = async (id) => {
    const rows = await userModel.findById(id)

    return rows
}

exports.createUser = async (data) => {
    const model = new userModel(data)
    const saveduser = await model.save()

    return saveduser
}

exports.udpateUser =async (id, data) => {
    const model = new userModel(data)
    const user = await model.updateOne({_id: id}, data);

    return user
}