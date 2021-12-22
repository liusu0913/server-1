const db = require('~/libs/db')
const { database } = global.config.mysql
const models = require('~/models')

exports.getSchemas = async () => {
  try {
    const tableList = new Set()
    for (const model in models) {
      tableList.add(`'${model}'`)
    }
    const tableNames = Array.from(tableList).join(',')
    const tableParams = 'TABLE_NAME,TABLE_COMMENT'
    const columnParams = 'TABLE_NAME,COLUMN_NAME,ORDINAL_POSITION,COLUMN_DEFAULT,IS_NULLABLE,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH,COLUMN_COMMENT'
    const tables = await db.query(`SELECT ${tableParams} from INFORMATION_SCHEMA.TABLES where table_schema = '${database}' and table_name in (${tableNames})`)
    const columns = await db.query(`SELECT ${columnParams} from INFORMATION_SCHEMA.COLUMNS where table_schema = '${database}' and table_name in (${tableNames})`)
    const schemas = {}
    tableList.forEach((table) => {
      schemas[table.replace(/'/g, '')] = []
    })
    tables[0].forEach((item) => {
      schemas[item.TABLE_NAME].push(item.TABLE_COMMENT)
    })
    columns[0].forEach((item) => {
      schemas[item.TABLE_NAME].push(item)
    })
    return schemas
  } catch (ex) {
    console.error(ex)
  }
}
