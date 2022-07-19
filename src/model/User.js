/*model-Schema*/
//User.js
//数据库模型
const mongoose = require('../db/db');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true  //唯一值，不可重复
    },
    password: String,
    netName: String,
    email: String,
    age: Number,
    city: String,
    gender: {
        type: Number,
        default: 0  //0-保密 1-男 2-女
    }
}, { timestamps: true });

//mongoose自动创建 user collection
const User = mongoose.model('user', UserSchema);

module.exports = User;