const sequelize = require('~/libs/db')
const companyModel = require('~/models/company')
const company = companyModel(sequelize)
const userModel = require('~/models/user')
const user = userModel(sequelize)

module.exports = {
  company,
  user
}
