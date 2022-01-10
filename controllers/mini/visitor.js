const util = require('~/util');
const service = require('~/service/mini/visitor');

exports.visitor = async (ctx) => {
  try {
    ctx.body = await service.visitor(ctx);
  } catch (error) {
    ctx.body = util.format.errHandler(error);
  }
}

exports.rank = async (ctx) => {
  try {
    ctx.body = await service.rank(ctx);
  } catch (error) {
    ctx.body = util.format.errHandler(error);
  }
}
