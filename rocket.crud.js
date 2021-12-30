const fs = require('fs')
const path = require('path')
const {
  ROCKET_ENV = 'development'
} = process.env
const envPath = path.resolve(`./config/config.${ROCKET_ENV}.js`)
fs.stat(envPath, (err, stat) => {
  if (err) {
    throw err
  }
  if (!stat.isFile()) {
    throw new Error(`${envPath}不是一个文件！`)
  }
})
const config = require(envPath)
const {
  mysql = ''
} = config
console.log(mysql)
if (mysql !== '') {
  mysql.user = mysql.username
  delete mysql.username
  module.exports = {
    dbConfig: mysql,
    rules: {
      association: true,
      controller: true,
      service: true,
      table: true,
      validator: true
    },
    modules: [
      { // 管理端——用户
        controller: 'admin/system/active',
        service: 'admin/active',
        table: 'active',
        validator: true
      }
    ],
    associations: [
      {
        source: 'active',
        foreign: 'activeTags',
        relation: 'hasMany',
        options: {
          sourceKey: 'active_id',
          foreignKey: 'active_id'
        }
      }
    ]
  }
} else {
  console.log('not found mysql config file')
}
