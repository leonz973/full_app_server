/**middleware中间件*/
/*loginCheck.js*/

//登录验证
async function loginCheck(ctx, next) {
    await next().catch((err)=>{
        if(err.status == '401'){
            ctx.status = 200;
            ctx.body = {
                status: '401',
                data: null,
                message: 'Token认证失败,请重新登录！'
            }
        }
    })
};

module.exports = loginCheck;