const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type : String,
        required : true,
        trim: true,
    },
    password: {
        type : String,
        required : true,
    },
    emailAddress: {
        type : String,
        required : true,
        maxlength: 64,
        unique: true,
        trim: true,
    },
    refresToken: {
        type : String,
    },
    createdAt: { 
        type: Date,
        default: Date.now
    }
}, { collection: 'auth' });

userSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

const User = mongoose.model('users', userSchema);

module.exports = User;