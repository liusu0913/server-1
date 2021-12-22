const winston = require('winston')
const als = require('async-local-storage')
const DailyRotateFile = require('winston-daily-rotate-file')
const fs = require('fs')

const env = process.env.NODE_ENV || 'development'
const logDir = 'log'
const logFileName = 'koa-seed'

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

module.exports = (fileName = 'default') => {
  const logFormat = winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.printf((info) => {
      return `${info.timestamp}|${info.level}|${
        als.get('traceId') || ''
      }|${fileName}|${info.message}`
    })
  )

  const dailyTransport = new DailyRotateFile({
    filename: logFileName + '-%DATE%.log',
    dirname: logDir,
    datePattern: 'YYYYMMDD',
    zippedArchive: true,
    maxSize: '200m',
    maxFiles: '7d'
  })

  const logger = winston.createLogger({
    // change level if in dev environment versus production
    level: env === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [dailyTransport]
  })

  if (env === 'development') {
    logger.add(new winston.transports.Console())
  }

  const logName = ['silly', 'debug', 'verbose', 'http', 'info', 'warn', 'error']
  logName.forEach((e) => {
    if (Reflect.has(logger, e) && typeof logger[e] === 'function') {
      const y = logger[e]
      logger[e] = function () {
        Reflect.apply(y, undefined, [[...arguments].join('|')])
      }
    }
  })

  return logger
}
