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

exports.createUser = async (data) => {
    const model = new userModel(data)
    const saveduser = await model.save()

    return saveduser
}

exports.udpateUser =async (id, data) => {
    const model = new userModel(data)
    const user = await userModel.updateOne({_id: id}, data);

    return user
}
exports.deleteUser =async (id, data) => {
    const model = new userModel(data)
    const user = await userModel.deleteOne({_id: id});

    return user
}