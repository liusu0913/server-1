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
        controller: 'admin/system/wxuser',
        service: 'admin/wxuser',
        table: 'wxuser',
        validator: true
      }
    ],
    associations: [
      {
        source: 'active',
        foreign: 'activeTags',
        relation: 'hasMany',
        options: {
          sourceKey: 'activeId',
          foreignKey: 'activeId',
          as: 'tags'
        }
      }, {
        source: 'active',
        foreign: 'activeType',
        relation: 'belongsTo',
        options: {
          sourceKey: 'id',
          foreignKey: 'typeId',
          as: 'type'
        }
      }, {
        source: 'activeTags',
        foreign: 'tags',
        relation: 'belongsTo',
        options: {
          sourceKey: 'id',
          foreignKey: 'tagId',
          as: 'tag'
        }
      }
    ]
  }
} else {
  console.log('not found mysql config file')
}
