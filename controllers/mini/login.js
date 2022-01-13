const util = require('~/util');
const schema = require('~/validators/mini/login');
const service = require('~/service/mini/login');

exports.sendSms = async (ctx) => {
  try {
    const data = ctx.request.body;
    await util.validator.check(schema, 'sendSms', data);
    ctx.body = await service.sendSms(data, ctx);
  } catch (error) {
    ctx.body = util.format.errHandler(error);
  }
}

exports.login = async (ctx) => {
  try {
    const data = ctx.request.body;
    await util.validator.check(schema, 'login', data);
    ctx.body = await service.login(data);
  } catch (error) {
    ctx.body = util.format.errHandler(error);
  }
}

exports.updateOpenID = async (ctx) => {
  try {
    const data = ctx.request.body;
    await util.validator.check(schema, 'updateOpenID', data);
    ctx.body = await service.updateOpenID(data, ctx);
  } catch (error) {
    ctx.body = util.format.errHandler(error);
  }
}
