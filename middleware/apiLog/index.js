const debug = require('debug')('rocket-node:app')

module.exports = async function (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  debug(`${ctx.method} ${ctx.url} - ${ms}ms`)
}
