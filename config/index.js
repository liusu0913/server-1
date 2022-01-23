const path = require('path')
const extend = require('extend')

module.exports = function config (args) {
  // 将端口号写入环境变量
  if (args.port) {
    process.env.PORT = args.port
  }

  // 获取默认配置
  const cfg = require('../config/config')
  // 获取当前的环境
  const env = process.env.ROCKET_ENV || 'development'
  console.log(process.env.ROCKET_ENV)

  // 获取环境配置
  const envPath = path.resolve(`./config/config.${env}.js`)
  try {
    extend(cfg, require(envPath))
  } catch (err) {
    throw new Error(`Load ${env} Config Error：${envPath}`)
  }

  // 如果允许增量配置，则继承增量配置
  if (cfg.extend) {
    const extPath = path.resolve(cfg.extend)
    try {
      // 深复制
      extend(true, cfg, require(extPath))
    } catch (err) {
      throw new Error(`Load Extend Config Error：${extPath}`)
    }
  }

  return cfg
}
