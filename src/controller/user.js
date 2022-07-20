//Controller 控制器
//user.js
//user controller

const User = require('../model/User');

//登录
async function login(username, password) {
    //查找用户
    const user = await User.findOne({username});
    if(user !== null){
        const userbypass = await User.findOne({username, password});
        if(userbypass !== null) {
            //用户名密码都匹配
            //登录成功
            return {
                status: '000',
                data: {
                    username: userbypass.username,
                    netName: userbypass.netName,
                    _id: userbypass._id
                },
                message: ''
            }
        } else {
            //密码错误
            return {
                status: '-1',
                data: null,
                message: ''
            }
        }
    } else {
        //用户名未找到，未注册
        return {
            status: '404',
            data: null,
            message: ''
        }
    }
}

//注册
async function register(userInfo = {}) {
    //userInfo 包含用户注册信息
    const newUser = await User.create(userInfo);
    //返回新用户信息
    return newUser
};

//获取用户信息
async function getUserInfo(username) {

    const userInfo = await User.aggregate([
        {
            $match: {username}
        },
        {
            $project: {
                username: 1,
                gender: 1,
                netName: 1
            }
        }
    ])
    return userInfo[0];
}

//更改用户信息
async function updateUserInfo(userInfo) {
    const { _id, username, netName, gender} = userInfo
    //查询并更新
    const newData = await User.findOneAndUpdate(
        { _id, username },
        { netName, gender },
        { new: true }
    )
    return {
        username: newData.username,
        netName: newData.netName,
        gender: newData.gender
    }
}

//更改密码
async function changePassword(_id, username, oldPassword, newPassword) {
    //查询并更新
    const newData = await User.findOneAndUpdate(
        { _id, username, password: oldPassword },
        { password: newPassword },
        { new: true }
    )

    if(newData){
        return '000'
    } else {
        return '-1'
    }
}


module.exports = {
    login,
    register,
    getUserInfo,
    updateUserInfo,
    changePassword
}