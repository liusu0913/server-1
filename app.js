const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const Sentry = require('@sentry/node')
require('best-require')(process.cwd())

const argUtil = require('./util/args')
const args = argUtil.parseArg()
global.config = require('./config')(args)
const Middles = require('./middleware/')

Sentry.init({ dsn: 'https://886daee5b6d64d34bc14c610e0e745ab@report.url.cn/sentry/2813' })
onerror(app)

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
  }
}))

app.use(json())
app.use(require('koa-static')(`${__dirname}/public`))
app.use(views(`${__dirname}/views`, {
  map: { html: 'nunjucks' }
}))

app.use(Middles.apiLog)
app.use(Middles.auth(['/common/login', '/mini/login/sendSms', '/mini/login/login']))
app.use(Middles.router(app, { root: './controllers', ignore: ['third'] }))

// error-handling
app.on('error', (err, ctx) => {
  Sentry.withScope(scope => {
    scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request))
    Sentry.captureException(err)
  })
})

module.exports = app
