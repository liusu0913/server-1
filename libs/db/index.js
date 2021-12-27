const Sequelize = require('sequelize')
const { database, username, password, dialect, host, port } = global.config.mysql

const options = {
  host,
  dialect,
  port,
  logging: true,
  timezone: '+8:00',
  pool: {
    max: 20,
    min: 10,
    idle: 10000
  }
}

function customLogger (queryString, queryObject) {
  console.log(queryString) // outputs a string
  console.log(queryObject.bind) // outputs an array
}

const sequelize = new Sequelize(database, username, password, options)

sequelize.authenticate().then(() => console.log('connected')).catch(err => console.log(err))

module.exports = sequelize
