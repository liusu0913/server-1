const path = require('path')
const { ROCKET_ENV } = process.env
const envPath = path.resolve(`./config/config.${ROCKET_ENV}.js`)
const config = require(envPath)
const { mysql = '' } = config

if (mysql) {
  console.log(mysql)
  module.exports = {
    dbOptions: mysql,
    options: {
      type: 'js',
      camelCase: true, // 下划线转驼峰，如字段 user_id => userId，复合js的变量命名
      dir: 'models',
      skipTables: null // 调过生成的表，数组类型
    }
  }
} else {
  console.log('not found mysql config file')
}
