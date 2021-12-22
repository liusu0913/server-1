const util = require('~/util')
const CronJob = require('cron').CronJob
const frequent = '*/5 * * * * *'
const timezone = 'Asia/Shanghai'

const test = async () => {
  try {
    const job = await (() => {
      return async function () {
        const now = new Date()
        console.log('now', now)
      }
    })()
    // eslint-disable-next-line no-new
    new CronJob(frequent, job, null, true, timezone, null, true)
  } catch (error) {
    return util.errHandler(error)
  }
}

module.exports = {
  test
}
