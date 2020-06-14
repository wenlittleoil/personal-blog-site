const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const config = require('./config/conf')
const index = require('./routes/index')

// error handler
onerror(app)

// Koa's built-in `ctx.cookies.set` secret when option `signed` set to true
// These keys may be rotated
app.keys = [config.sessionSecret]

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
// app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

/**
 * mount session
 * @description note! 
 * koa-generic-session 当没有手动设置ctx.session时，session不会自动保存到store中
 * 这点和express-session不同
 */ 
app.use(session({
  key: config.session.key, // cookie name
  ttl: null, // means get ttl from cookie.maxAge
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: config.session.EXPIRE,
    signed: true,
  },
  rolling: false, // always reset the cookie and sessions, default false
  allowEmpty: false, // allow generation of empty sessions, default false
  prefix: 'sess:', // store key prefix
  store: redisStore({
    all: `${config.db.redis.host}:${config.db.redis.port}`,
    db: 1, // run client.select(db), default 0
    isRedisCluster: false,
  }),
}))
app.use(async (ctx, next) => {
  console.log(ctx.sessionId, ctx.session)
  ctx.user = ctx.session.user
  await next()
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
