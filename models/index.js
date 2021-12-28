const sequelize = require('~/libs/db')
const companyModel = require('~/models/company')
const company = companyModel(sequelize)
const tagsModel = require('~/models/tags')
const tags = tagsModel(sequelize)
const userModel = require('~/models/user')
const user = userModel(sequelize)
const wxuserModel = require('~/models/wxuser')
const wxuser = wxuserModel(sequelize)

module.exports = {
  company,
  tags,
  user,
  wxuser
}
