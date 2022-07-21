const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const cors = require('koa2-cors')  //跨域处理
const koaJwt = require('koa-jwt') //jwt token
const session = require('koa-generic-session')  //登录设置session

const koaStatic = require('koa-static');
const path = require('path');
app.use(koaStatic(path.join(__dirname, './upload'))) //将upload文件夹添加为静态资源路径

const index = require('./routes/index')
const users = require('./routes/users')
const comment = require('./routes/comment')
const upload = require('./routes/upload')
const loginCheck = require('./middleware/loginCheck')

// error handler
onerror(app)


//允许服务端支持跨域
app.use(cors({
    // origin: 'http://localhost:8081', // 支持前端哪个域，可以跨域
    credentials: true // 允许跨域的时候带着 cookie
}))



//配置 session
app.keys = ['msgb^1024'];//设置密钥，携带在cookie
app.use(session({
    cookie: {
        path:'/',
        httpOnly: true,//只允许服务端来操作cookie
        maxAge: 24 * 60 * 60 * 1000
    }
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
//   console.log('ctx.session', ctx.session)
})

// 注册登录鉴权中间件
app.use(loginCheck)

//在next() 前过滤接口 验证token是否过期-如果过期抛出异常401  unless跳过检测登录接口
app.use(koaJwt({secret:'jwtScrectKey'}).unless({
    path:[/^\/users\/login/, /^\/users\/register/,]		
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(comment.routes(), comment.allowedMethods())
app.use(upload.routes(), comment.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
