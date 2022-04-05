const SECRET = 'maikaiying'
// 未注册
const NO_REGISTER = 100001
// 登录失效
const LOGIN_EXPRESS = 100002
// 密码错误
const LOGIN_PASSWORD_ERROR = 100003
// 非法的token
const VOID_TOKEN = 10004
// 重复添加
const REPETADD = 10005
// 用户封禁或者删除
const USERBANNED = 10006
// 微信号已绑定
const WXREPEAT = 10007
// 用户不可用
const USERDELETE = 10008

module.exports = {
  USERDELETE,
  WXREPEAT,
  USERBANNED,
  NO_REGISTER,
  LOGIN_EXPRESS,
  LOGIN_PASSWORD_ERROR,
  SECRET,
  VOID_TOKEN,
  REPETADD
}
