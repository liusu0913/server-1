const Sequelize = require('sequelize')
const sequelize = require('~/libs/db')

/**
 * 唯一字段检查
 * @param {object} model 数据库操作对象
 * @param {object} uniqueWords 唯一字段
 * @param {number} id 自身id（更新时判断使用）
 */
const checkUnique = async (model, uniqueWords, id) => {
  const result = await model.findOne({
    where: {
      ...uniqueWords,
      disabled: 0
    }
  })
  if (id && result.id === id) {
    return true // 自身更新
  } else if (result) {
    return false
  } else {
    return true
  }
}

/**
   * mysql事务
   * @param {function} fun 执行方法
   * @param {object} args 参数
   */
const transaction = async (fun, args) => {
  return new Promise((resolve, reject) => {
    return sequelize.transaction(
      { type: Sequelize.Transaction.TYPES.EXCLUSIVE },
      async (transaction) => {
        try {
          args.transaction = transaction
          const result = await fun.call(this, args)
          resolve(result)
        } catch (ex) {
          transaction.rollback()
          reject(ex)
        }
      }
    )
  })
}

module.exports = {
  checkUnique,
  transaction
}
