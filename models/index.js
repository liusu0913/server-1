const sequelize = require('~/libs/db')
const activeModel = require('~/models/active')
const active = activeModel(sequelize)
const activeBiffuseModel = require('~/models/activeBiffuse')
const activeBiffuse = activeBiffuseModel(sequelize)
const activeRemindModel = require('~/models/activeRemind')
const activeRemind = activeRemindModel(sequelize)
const activeTagsModel = require('~/models/activeTags')
const activeTags = activeTagsModel(sequelize)
const activeTypeModel = require('~/models/activeType')
const activeType = activeTypeModel(sequelize)
const companyModel = require('~/models/company')
const company = companyModel(sequelize)
const fodderModel = require('~/models/fodder')
const fodder = fodderModel(sequelize)
const fodderTagModel = require('~/models/fodderTag')
const fodderTag = fodderTagModel(sequelize)
const pvLogModel = require('~/models/pvLog')
const pvLog = pvLogModel(sequelize)
const questionLogModel = require('~/models/questionLog')
const questionLog = questionLogModel(sequelize)
const remindTimeModel = require('~/models/remindTime')
const remindTime = remindTimeModel(sequelize)
const shareLogModel = require('~/models/shareLog')
const shareLog = shareLogModel(sequelize)
const stayMsgLogModel = require('~/models/stayMsgLog')
const stayMsgLog = stayMsgLogModel(sequelize)
const stayTimeLogModel = require('~/models/stayTimeLog')
const stayTimeLog = stayTimeLogModel(sequelize)
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

activeRemind.hasOne(active, {
  sourceKey: 'activeId',
  foreignKey: 'activeId',
  as: 'active'
})

activeTags.hasOne(active, {
  sourceKey: 'activeId',
  foreignKey: 'activeId',
  as: 'active'
})

pvLog.hasOne(active, {
  sourceKey: 'activeId',
  foreignKey: 'activeId',
  as: 'active'
})

shareLog.hasOne(active, {
  sourceKey: 'activeId',
  foreignKey: 'activeId',
  as: 'active'
})

pvLog.hasOne(wxuser, {
  sourceKey: 'openId',
  foreignKey: 'openId',
  as: 'user'
})

pvLog.hasOne(user, {
  sourceKey: 'jobId',
  foreignKey: 'jobId',
  as: 'staff'
})

pvLog.hasOne(wxuser, {
  sourceKey: 'sourceOpenId',
  foreignKey: 'openId',
  as: 'sourceUser'
})

wxuser.hasMany(pvLog, {
  sourceKey: 'openId',
  foreignKey: 'openId',
  as: 'record'
})

fodder.hasMany(fodderTag, {
  sourceKey: 'fodderId',
  foreignKey: 'fodderId',
  as: 'tags'
})
fodderTag.hasOne(fodder, {
  sourceKey: 'fodderId',
  foreignKey: 'fodderId',
  as: 'fodder'
})
fodderTag.belongsTo(tags, {
  sourceKey: 'id',
  foreignKey: 'tagId',
  as: 'tag'
})

module.exports = {
  active,
  activeBiffuse,
  activeRemind,
  activeTags,
  activeType,
  company,
  fodder,
  fodderTag,
  pvLog,
  questionLog,
  remindTime,
  shareLog,
  stayMsgLog,
  stayTimeLog,
  tags,
  user,
  wxuser
}
