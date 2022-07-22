/*model-Schema*/
//Comment.js
//数据库模型
const mongoose = require('../db/db');

const CommentSchema = mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    pics: {
        type: Array
    },
    update_time: String,
    username: String
}, { timestamps: true });

//mongoose自动创建 comment collection
const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;