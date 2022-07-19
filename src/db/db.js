//db.js
//连接数据库的处理模块（Module）
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017';
const dbName = 'appdemo';

//配置
// mongoose.set('xxxxxx', true);

//连接数据库
mongoose.connect(`${url}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//获取连接所需要的信息提示connection对象
const conn = mongoose.connection;

//连接错误
conn.on('error', err =>{
    console.log('mongodb 连接失败', err);
})

//导出module
module.exports = mongoose