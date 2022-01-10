const users = require('../admin/user');
const redis = require('~/libs/redis');
const {SECRET} = require("~/const");
const jwt = require('jsonwebtoken');

module.exports = {
  async sendSms(body, ctx) {
    const jobId = body.jobId
    const phone = body.phone
    const result = await users.infoMini({jobId, phone})
    if (!result) {
      throw new Error('工号或手机号错误')
    }
    const verifyCode = Math.random().toString().slice(-6);
    // ip限制防止恶意刷接口
    const ipTimes = await redis.get(ctx.request.ip)
    if (ipTimes != null) {
      throw new Error('发送过于频繁');
    }
    await redis.setex(ctx.request.ip, 1, 60)
    await redis.setex(process.env.DEBUG + jobId + phone, verifyCode, global.config.codeEx)
    // TODO sendSms
    return {
      code: 0,
      message: 'success'
    }
  },

  async login(body) {
    const jobId = body.jobId;
    const phone = body.phone;
    const code = body.code;
    const data = await users.infoMini({jobId, phone});
    if (!data) {
      throw new Error('工号或手机号错误');
    }
    const codeRedis = await redis.get(process.env.DEBUG + jobId + phone);
    if (codeRedis == null) {
      throw new Error('验证码失效');
    } else if (codeRedis !== code) {
      const retryTimes = await redis.incr(process.env.DEBUG + jobId + phone + 'retryTimes');
      if (retryTimes === 1) {
        await redis.expire(process.env.DEBUG + jobId + phone + 'retryTimes', 60);
      } else if (retryTimes > 5) {
        throw new Error('过于频繁，稍后再试');
      }
      throw new Error('验证码错误');
    }
    await redis.del(process.env.DEBUG + jobId + phone);
    const token = await jwt.sign({
      jobId: data.jobId,
      name: data.name,
      phone: data.phone,
      companyId: data.companyId,
      role: data.role,
      belongCompany: data.belongCompany
    }, SECRET, {
      expiresIn: '7d'
    })
    return {
      code: 0,
      data: {
        token: token
      },
      message: 'success'
    }
  }
}
