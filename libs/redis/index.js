/* eslint-disable promise/param-names */
var redis = require('redis')
const config = global.config
const logger = require('~/util/logger')(__filename)

class RedisUtil {
  constructor () {
    this.client = redis.createClient({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
          return new Error('The server refused the connection')
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          return new Error('Retry time exhausted')
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000)
      }
    })
    this.client.auth(config.redis.password)

    this.client.on('error', function (err) {
      logger.error(`error|err.message:${err.message}|err.stack:${err.stack}`)
    })
  }

  async exists (k) {
    return new Promise((resolve, reject) => {
      this.client.exists(k, function (err, res) {
        if (err) {
          logger.error(
            `exists|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis exists error:${err.message}`))
        } else {
          logger.info(`exists|k:${k}|res:${JSON.stringify(res)}`)
          resolve(res)
        }
      })
    })
  }

  async hgetall (k) {
    return new Promise((resolve, reject) => {
      this.client.hgetall(k, function (err, res) {
        if (err) {
          logger.error(
            `hgetall|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis hgetall error:${err.message}`))
        } else {
          logger.info(`hgetall|k:${k}|res:${JSON.stringify(res)}`)
          resolve(res)
        }
      })
    })
  }

  async hmset (k, item) {
    return new Promise((resolve, reject) => {
      this.client.hmset(k, item, function (err, res) {
        if (err) {
          logger.error(
            `hmset|k:${k}|item:${JSON.stringify(item)}|err.message:${
              err.message
            }|err.stack:${err.stack}`
          )
          reject(new Error(`redis hmset error:${err.message}`))
        } else {
          logger.info(`hmset|k:${k}|item:${JSON.stringify(item)}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async hset (k, subk, v) {
    return new Promise((resolve, reject) => {
      this.client.hset(k, subk, v, function (err, res) {
        if (err) {
          logger.error(
            `hset|k:${k}|subk:${subk}|v:${v}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis hset error:${err.message}`))
        } else {
          logger.info(`hset|k:${k}|subk:${subk}|v:${v}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async expire (k, sec) {
    return new Promise((resolve, reject) => {
      this.client.expire(k, sec, function (err, res) {
        if (err) {
          logger.error(
            `expire|k:${k}|sec:${sec}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis expire error:${err.message}`))
        } else {
          logger.info(`expire|k:${k}|sec:${sec}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async pexpire (k, milisec) {
    return new Promise((resolve, reject) => {
      this.client.pexpire(k, milisec, function (err, res) {
        if (err) {
          logger.error(
            `pexpire|k:${k}|milisec:${milisec}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis pexpire error:${err.message}`))
        } else {
          logger.info(`pexpire|k:${k}|milisec:${milisec}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async incr (k) {
    return new Promise((resolve, reject) => {
      this.client.incr(k, function (err, res) {
        if (err) {
          logger.error(
            `incr|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis incr error:${err.message}`))
        } else {
          logger.info(`incr|k:${k}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async decr (k) {
    return new Promise((resolve, reject) => {
      this.client.decr(k, function (err, res) {
        if (err) {
          logger.error(
            `decr|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis decr error:${err.message}`))
        } else {
          logger.info(`decr|k:${k}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async setbit (k, offset, v = 0) {
    return new Promise((resolve, reject) => {
      this.client.setbit(k, offset, v, function (err, res) {
        if (err) {
          logger.error(
            `setbit|k:${k}|offset:${offset}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis setbit error:${err.message}`))
        } else {
          logger.info(`setbit|k:${k}|offset:${offset}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async getbit (k, offset) {
    return new Promise((resolve, reject) => {
      this.client.getbit(k, offset, function (err, res) {
        if (err) {
          logger.error(
            `getbit|k:${k}|offset:${offset}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis getbit error:${err.message}`))
        } else {
          logger.info(`getbit|k:${k}|offset:${offset}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async bitcount (k) {
    return new Promise((resolve, reject) => {
      this.client.bitcount(k, function (err, res) {
        if (err) {
          logger.error(
            `bitcount|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis bitcount error:${err.message}`))
        } else {
          logger.info(`bitcount|k:${k}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async set (k, v) {
    return new Promise((resolve, reject) => {
      this.client.set(k, v, function (err, res) {
        if (err) {
          logger.error(
            `set|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis set error:${err.message}`))
        } else {
          logger.info(`set|k:${k}|v:${v}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async setex (k, v, durationSecs) {
    return new Promise((resolve, reject) => {
      this.client.set(k, v, 'EX', durationSecs, function (err, res) {
        if (err) {
          logger.error(
            `setex|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis setex error:${err.message}`))
        } else {
          logger.info(`setex|k:${k}|v:${v}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async get (k) {
    return new Promise((resolve, reject) => {
      this.client.get(k, function (err, res) {
        if (err) {
          logger.error(
            `get|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis get error:${err.message}`))
        } else {
          logger.info(`get|k:${k}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async del (k) {
    return new Promise((resolve, reject) => {
      this.client.del(k, function (err, res) {
        if (err) {
          logger.error(
            `del|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis delete error:${err.message}`))
        } else {
          logger.info(`del|k:${k}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async zadd (k, member, score) {
    return new Promise((resolve, reject) => {
      this.client.zadd(k, score, member, function (err, res) {
        if (err) {
          logger.error(
            `zadd|k:${k}|member:${member}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis zadd error:${err.message}`))
        } else {
          logger.info(`zadd|k:${k}|member:${member}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async zrange (k, start, end) {
    return new Promise((resolve, reject) => {
      this.client.zrange(k, start, end, function (err, res) {
        if (err) {
          logger.error(
            `zrange|k:${k}|start:${start}|end:${end}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis zrange error:${err.message}`))
        } else {
          logger.info(
            `zrange|k:${k}|start:${start}|end:${end}|res:${JSON.stringify(
              res
            )}`
          )
          resolve(res)
        }
      })
    })
  }

  async zrange_withscore (k, start, end) {
    return new Promise((resolve, reject) => {
      this.client.zrange(k, start, end, 'WITHSCORES', function (err, res) {
        if (err) {
          logger.error(
            `zrange_withscore|k:${k}|start:${start}|end:${end}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis zrange error:${err.message}`))
        } else {
          logger.info(
            `zrange_withscore|k:${k}|start:${start}|end:${end}|res:${JSON.stringify(
              res
            )}`
          )
          resolve(res)
        }
      })
    })
  }

  async zrank (k, member) {
    return new Promise((resolve, reject) => {
      this.client.zrank(k, member, function (err, res) {
        if (err) {
          logger.error(
            `zrank|k:${k}|member:${member}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis zrank error:${err.message}`))
        } else {
          logger.info(
            `zrank|k:${k}|member:${member}|res:${JSON.stringify(res)}`
          )
          resolve(res)
        }
      })
    })
  }

  async zcard (k) {
    return new Promise((resolve, reject) => {
      this.client.zcard(k, function (err, res) {
        if (err) {
          logger.error(
            `zcard|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis zcard error:${err.message}`))
        } else {
          logger.info(`zcard|k:${k}|res:${res}`)
          resolve(res)
        }
      })
    })
  }

  async zremrangebyscore (k, start, stop) {
    return new Promise((resolve, reject) => {
      this.client.zremrangebyscore(k, start, stop, function (err, res) {
        if (err) {
          logger.error(
            `zremrangebyscore|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis zremrangebyscore error:${err.message}`))
        } else {
          logger.info(
            `zremrangebyscore|k:${k}|start:${start}|stop:${stop}|res:${res}`
          )
          resolve(res)
        }
      })
    })
  }

  async zremrangebyrank (k, start, stop) {
    return new Promise((resolve, reject) => {
      this.client.zremrangebyrank(k, start, stop, function (err, res) {
        if (err) {
          logger.error(
            `zremrangebyrank|k:${k}|err.message:${err.message}|err.stack:${err.stack}`
          )
          reject(new Error(`redis zremrangebyrank error:${err.message}`))
        } else {
          logger.info(
            `zremrangebyrank|k:${k}|start:${start}|stop:${stop}|res:${res}`
          )
          resolve(res)
        }
      })
    })
  }
}

module.exports = new RedisUtil()
