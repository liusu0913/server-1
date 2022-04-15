const { user, fodder, active, wxuser, pvLog, shareLog, questionLog, stayMsgLog, stayTimeLog } = require('~/models')
const util = require('~/util')
const logger = require('~/util/logger')(__filename)
const xlsx = require('xlsx')
const Sequelize = require('sequelize')
const op = Sequelize.Op

const forMatXlsxData = (data) => {
  const result = []
  const keyMap = {
    姓名: 'name',
    工号: 'jobId',
    手机号: 'phone',
    机构代码: 'companyId',
    机构地址: 'company',
    职位: 'title'
  }
  data.forEach(async user => {
    const userInfo = {}
    Object.keys(user).forEach(key => {
      userInfo[keyMap[key]] = `${user[key]}`
    })
    result.push(userInfo)
  })
  return result
}

const formatTree = (tree, item) => {
  if (item.companyId === tree.companyId) return
  if (item.companyId.indexOf(tree.companyId) === 0) {
    // 包含关系
    if (item.companyId.length - tree.companyId.length === 2) {
      const hasCompany = tree.children.filter((company) => {
        return company.companyId === item.companyId
      })
      if (hasCompany.length) return
      // 直系子
      tree.children.push({
        company: item.company,
        companyId: item.companyId
      })
    } else {
      // 隔代子
      tree.children.forEach((i) => {
        if (!i.children) {
          i.children = []
        }
        formatTree(i, item)
      })
    }
  }
}

module.exports = {
  async filialeTree (ctx) {
    try {
      const { session_user } = ctx
      const where = {
        companyId: {
          [op.like]: `${session_user.companyId}%`
        },
        belongCompany: session_user.belongCompany,
        role: 3
      }
      const res = await user.findAll({
        attributes: ['companyId', 'company'],
        where
      })
      let tree = {}
      const company = res.filter((item) => item.companyId === session_user.companyId)
      if (company.length) {
        tree = {
          companyId: session_user.companyId,
          company: company[0].company,
          children: []
        }
      }
      const list = res.sort((a, b) => {
        return a.companyId.length - b.companyId.length
      })
      list.forEach((item) => {
        formatTree(tree, item)
      })
      return {
        code: 0,
        data: tree,
        message: 'success'
      }
    } catch (ex) {
      logger.error(`delete|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async getCompanyStaff (data, ctx) {
    // 查找列表需要根据公司id的层级条件进行查找
    try {
      const { session_user } = ctx
      const { role, companyId } = data
      const result = await user.findAll({
        where: {
          role,
          companyId,
          belongCompany: session_user.belongCompany
        }
      })
      return {
        code: 0,
        data: {
          where: {
            role,
            companyId,
            belongCompany: session_user.belongCompany
          },
          list: result
        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async batchHandle (data, ctx) {
    try {
      const { session_user } = ctx
      const { jobIds, type } = data
      delete data.jobIds
      delete data.type
      const where = {
        jobId: {
          [op.in]: jobIds
        },
        belongCompany: session_user.belongCompany
      }
      let count = 0
      if (type) {
        // 激活和停用
        [count] = await user.update(data, { where })
      } else {
        // 删除
        count = await user.destroy({ where })
      }
      return util.format.sucHandler({ count })
    } catch (ex) {
      logger.error(`delete|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async allList (data, ctx) {
    // 查找列表需要根据公司id的层级条件进行查找
    try {
      const { session_user } = ctx
      const { role } = data
      const result = await user.findAll({
        ...data,
        where: {
          role,
          companyId: {
            [op.like]: `${ctx.session_user.companyId}%`
          },
          belongCompany: session_user.belongCompany
        }
      })
      return {
        code: 0,
        data: {
          list: result
        },
        message: 'success'
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async list (data, ctx) {
    // 查找列表需要根据公司id的层级条件进行查找
    try {
      const { session_user } = ctx
      const searchKey = ['name', 'jobId', 'phone']
      data = util.format.dataProcessor(data)
      const { where } = data
      searchKey.forEach(key => {
        if (where[key]) {
          where[key] = {
            [op.like]: `%${where[key]}%`
          }
        }
      })
      const result = await user.findAndCountAll({
        ...data,
        where: {
          ...where,
          companyId: {
            [op.like]: `${ctx.session_user.companyId}%`
          },
          belongCompany: session_user.belongCompany
        }
      })
      return util.format.sucHandler(result, 'list')
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async create (data, ctx) {
    try {
      const { session_user } = ctx
      if (session_user.role) {
        data.belongCompany = session_user.belongCompany
      }
      if (data.companyId.indexOf(session_user.companyId) !== 0) {
        if (
          session_user.companyId.indexOf(data.companyId) === 0 &&
          data.companyId.length < session_user.companyId.length
        ) {
          return {
            code: 1002,
            message: '权限错误：不能创建上层公司员工'
          }
        } else {
          return {
            code: 1002,
            message: '权限错误：不能其他分机构的员工'
          }
        }
      }
      const result = await user.create(data)
      return util.format.sucHandler(result)
    } catch (ex) {
      logger.error(`create|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async update (data, where = {}, ctx) {
    try {
      const { session_user } = ctx
      where = {
        ...where,
        belongCompany: session_user.belongCompany
      }
      const [count = 0] = await user.update(data, { where })
      if (count > 0) {
        return util.format.sucHandler({ count })
      } else {
        return util.format.errHandler('更新失败，没有找到可以更新的记录!')
      }
    } catch (ex) {
      logger.error(`update|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async delete ({ where }, data, ctx) {
    try {
      const { session_user } = ctx
      const { jobId } = where
      const { transToJobId } = data
      const userInfo = await user.findOne({
        where: {
          jobId: transToJobId,
          belongCompany: session_user.belongCompany
        }
      })

      if (!userInfo) {
        return {
          code: 1002,
          message: `未查找到工号为《${transToJobId}》的员工`
        }
      } else {
        const logWhere = {
          jobId,
          belongCompany: session_user.belongCompany
        }
        const logData = {
          jobId: transToJobId,
          name: userInfo.name,
          companyId: userInfo.companyId,
          company: userInfo.company
        }
        pvLog.update(logData, { where: logWhere })
        shareLog.update(logData, { where: logWhere })
        questionLog.update(logData, { where: logWhere })
        stayMsgLog.update(logData, { where: logWhere })
        stayTimeLog.update(logData, { where: logWhere })
        wxuser.update({
          sourceJobId: transToJobId
        }, {
          where: {
            sourceJobId: jobId,
            belongCompany: session_user.belongCompany
          }
        })
        const contentData = {
          createCompanyCode: userInfo.companyId,
          createId: transToJobId
        }
        const contentWhere = {
          createId: jobId,
          belongCompany: session_user.belongCompany
        }
        fodder.update(contentData, {
          where: contentWhere
        })
        active.update(contentData, {
          where: contentWhere
        })
      }
      where = {
        ...where,
        belongCompany: session_user.belongCompany
      }
      const count = await user.destroy({ where })
      if (count > 0) {
        return util.format.sucHandler({ count })
      } else {
        return util.format.errHandler('记录已被删除或不存在该记录!')
      }
    } catch (ex) {
      logger.error(`delete|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async info (where, ctx) {
    try {
      const { session_user } = ctx
      where = {
        ...where,
        belongCompany: session_user.belongCompany
      }
      const result = await user.findOne({ where })
      if (result) {
        return util.format.sucHandler(result)
      } else {
        return util.format.errHandler('没有找到任何符合条件的记录!')
      }
    } catch (ex) {
      logger.error(`info|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  },
  async infoMini (where) {
    try {
      return await user.findOne({ where })
    } catch (ex) {
      logger.error(`info|error:${ex.message}|stack:${ex.stack}`)
      return null
    }
  },
  async batchAdd ({ filePath, type, role, ctx }) {
    const that = this
    const workbook = await xlsx.readFile(filePath)
    const sheetNames = workbook.SheetNames // 返回 ['sheet1', ...]
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      let data = xlsx.utils.sheet_to_json(worksheet)
      data = forMatXlsxData(data)
      let returmMsg = ''
      // type:0覆盖；type：1跳过
      for (let i = 0; i < data.length; i++) {
        const userInfo = data[i]
        userInfo.role = role
        if (userInfo.jobId) {
          const findUserMsg = await that.info({ jobId: userInfo.jobId }, ctx)
          if (findUserMsg.code === 0) {
            // 存在用户再次插入
            if (type) {
              returmMsg += `跳过工号为${userInfo.jobId}的员工信息录入；`
              continue
            } else {
              const res = await that.update(userInfo, { jobId: userInfo.jobId }, ctx)
              if (res.code) {
                returmMsg += `工号${userInfo.jobId}录入错误：${res.message}；`
              } else {
                returmMsg += `重写工号为${userInfo.jobId}的员工信息；`
              }
            }
          } else {
            const res = that.create(userInfo, ctx)
            if (res.code) {
              returmMsg += `工号${userInfo.jobId}录入错误：${res.message}；`
            }
          }
        } else {
          returmMsg += `用户${userInfo.name}未查找到工号；`
          continue
        }
      }
      return {
        code: 0,
        message: returmMsg || 'success'
      }
    }
  },
  async userCount (ctx) {
    // 查找列表需要根据公司id的层级条件进行查找
    try {
      const { session_user } = ctx
      const { where } = {
        belongCompany: session_user.belongCompany

      }
      const result = await user.findAndCountAll({
        where
      })
      return {
        code: 0,
        data: {
          all: result
        }
      }
    } catch (ex) {
      logger.error(`list|error:${ex.message}|stack:${ex.stack}`)
      return util.format.errHandler(ex)
    }
  }
}
