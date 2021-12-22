const dayjs = require('dayjs')

const currentTime = () => {
  return (new Date()).getTime()
}

const timeDiff = (timespan) => {
  const nowTime = currentTime()
  return (nowTime - timespan) / 1000
}

const format = (timespan, setting = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(timespan).format(setting)
}

const log = (message, timespan) => {
  console.log(`${message}：${format(timespan)}`)
}

module.exports = {
  currentTime,
  timeDiff,
  format,
  log
}
