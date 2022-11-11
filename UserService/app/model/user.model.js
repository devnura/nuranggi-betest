const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type : String,
        required : true,
        trim: true,
    },
    accountNumber: {
        type : String,
        required : true,
        trim: true,
        index: true,
        unique: true
    },
    emailAddress: {
        type : String,
        required : true,
        maxlength: 64,
        unique: true,
        trim: true,
    },
    createdAt: { 
        type: Date,
        default: Date.now
    }
},{ collection: 'user' });

userSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

const User = mongoose.model('users', userSchema);

module.exports = User;