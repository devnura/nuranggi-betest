const userModel = require("../model/user.model")

exports.fetchAll = async (limit, offset) => {
    const rows = await userModel.find().limit(limit)
        .skip(offset)
        .exec()

    const count = await userModel.count();

    return {
        rows,
        count
    }
}

exports.findById = async (id) => {
    const rows = await userModel.findById(id)

    return rows
}

exports.findByAccountNumber  = async (accountNumber) => {
    const rows = await userModel.findOne({ accountNumber: accountNumber }).exec()

    return rows
}

exports.findByIdentityNumber  = async (identityNumber) => {
    const rows = await userModel.findOne({ identityNumber: identityNumber }).exec()

    return rows
}
exports.findByEmailAddress  = async (emailAddress) => {
    const rows = await userModel.findOne({ emailAddress: emailAddress }).exec()

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
exports.deleteUser =async (id, data) => {
    const model = new userModel(data)
    const user = await model.delete({_id: id});

    return user
}