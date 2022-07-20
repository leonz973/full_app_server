const router = require('koa-router')()
const { register, login, getUserInfo, updateUserInfo, changePassword } = require('../controller/user');
const loginCheck = require('../middleware/loginCheck');
const jwt = require('jsonwebtoken')
const crypto = require('../utils/crypto/crypto');


router.prefix('/users')

//获取用户信息
router.get('/getUserInfo', loginCheck, async(ctx, next) =>{
    //从token中获取用户
    const { username } = ctx.state.user.data;

    //获取用户信息
    const userInfo = await getUserInfo(username);
    ctx.body = {
        status: '000',
        data: userInfo,
        message: ''
    }
})

//修改用户信息
router.post('/updateUserInfo', loginCheck, async(ctx, next) =>{
    //从token中获取用户
    const { username } = ctx.state.user.data;
    // console.log(ctx.state.user.data)
    let { userInfo } = ctx.request.body
    userInfo.username = username
    const newUserInfo = await updateUserInfo(userInfo)
    ctx.body = {
        status: '000',
        data: {
            userInfo: newUserInfo
        },
        message: '修改成功'
    }
})

//登录
router.post('/login', async(ctx, next) =>{
    //获取登录信息
    let { username, password } = ctx.request.body;
    username = crypto.aesUtil.decryptByAESModeEBC(username);
    password = crypto.aesUtil.decryptByAESModeEBC(password);
    //验证登录
    const res = await login(username, password); //调用controller
    switch(res.status) {
        case '404':
            //登录失败
            ctx.body = {
                status: '-1',
                message: '用户不存在',
                data: null
            }
        break;
        case '000':
            const data = res.data || res
            const token = jwt.sign({
                data
            }, 'jwtScrectKey', {expiresIn: 60 * 60 * 24}) //一天有效期
            ctx.body = {
                status: '000',
                message: '登录成功',
                data: {
                    token: token,
                    userInfo: res.data
                }
            }
        break;
        case '-1': 
            //登录失败
            ctx.body = {
                status: '-1',
                message: '用户名或密码错误',
                data: null
            }
        break;
    }

})

//注册
router.post('/register', async(ctx, next) =>{
    //获取注册信息
    let { userInfo } = ctx.request.body;
    userInfo.username = crypto.aesUtil.decryptByAESModeEBC(userInfo.username);
    userInfo.password = crypto.aesUtil.decryptByAESModeEBC(userInfo.password);
    //提交注册  注册逻辑在controller
    try{
        await register(userInfo); //调用controller
        ctx.body = {
            status: '000',
            data: null,
            message: '注册成功'
        }

    } catch(ex) {
        console.log('注册失败', ex);
        ctx.body = {
            status: '-1',
            message: '注册失败',
            data: null
        }
    }
})

//修改密码
router.post('/changePassword', loginCheck, async(ctx, next) =>{
    //获取请求信息
    let { oldPassword, newPassword } = ctx.request.body;
    oldPassword = crypto.aesUtil.decryptByAESModeEBC(oldPassword);
    newPassword = crypto.aesUtil.decryptByAESModeEBC(newPassword);

    //从token中获取用户
    let { _id, username } = ctx.state.user.data;

    console.log(_id, username, oldPassword, newPassword)

    try{
        let status = await changePassword(_id, username, oldPassword, newPassword); //调用controller
        switch(status) {
            case '-1':
                //验证失败
                ctx.body = {
                    status: '-1',
                    message: '原密码错误',
                    data: null
                }
            break;
            case '000':
                ctx.body = {
                    status: '000',
                    message: '修改成功',
                    data: null
                }
            break;
        }

    } catch(ex) {
        console.log('修改失败', ex);
        ctx.body = {
            status: '-1',
            message: '修改失败',
            data: null
        }
    }
})

module.exports = router
