const sequelize = require('~/libs/db')
const userModel = require('~/models/user')
const user = userModel(sequelize)

module.exports = {
  user
}
