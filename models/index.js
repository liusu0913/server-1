const sequelize = require('~/libs/db')
const activeModel = require('~/models/active')
const active = activeModel(sequelize)
const activeBiffuseModel = require('~/models/activeBiffuse')
const activeBiffuse = activeBiffuseModel(sequelize)
const activeTagsModel = require('~/models/activeTags')
const activeTags = activeTagsModel(sequelize)
const activeTypeModel = require('~/models/activeType')
const activeType = activeTypeModel(sequelize)
const companyModel = require('~/models/company')
const company = companyModel(sequelize)
const pvLogModel = require('~/models/pvLog')
const pvLog = pvLogModel(sequelize)
const shareLogModel = require('~/models/shareLog')
const shareLog = shareLogModel(sequelize)
const stayMsgLogModel = require('~/models/stayMsgLog')
const stayMsgLog = stayMsgLogModel(sequelize)
const tagsModel = require('~/models/tags')
const tags = tagsModel(sequelize)
const userModel = require('~/models/user')
const user = userModel(sequelize)
const wxuserModel = require('~/models/wxuser')
const wxuser = wxuserModel(sequelize)

active.hasMany(activeTags, {
  sourceKey: 'activeId',
  foreignKey: 'activeId',
  as: 'tags'
})

active.belongsTo(activeType, {
  sourceKey: 'id',
  foreignKey: 'typeId',
  as: 'type'
})

activeTags.belongsTo(tags, {
  sourceKey: 'id',
  foreignKey: 'tagId',
  as: 'tag'
})

module.exports = {
  active,
  activeBiffuse,
  activeTags,
  activeType,
  company,
  pvLog,
  shareLog,
  stayMsgLog,
  tags,
  user,
  wxuser
}
