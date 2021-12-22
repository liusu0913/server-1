const path = require('path')
const route = require('koa-route')
const glob = require('glob')
const debug = require('debug')('rocket-node:router')
const error = require('debug')('rocket-node-error:router')
// 可以注册的方法
const METHOD_ALLOWED = ['get', 'post', 'put', 'patch', 'del', 'head', 'delete', 'all']
module.exports = function (app, options) {
  if (typeof options === 'string') {
    options = { root: options }
  } else if (!options || !options.root) {
    throw new Error('`root` config required.')
  }
  const root = options.root
  const ignorePath = options.ignore || ['node_modules']
  glob.sync('**/*.js', {
    root: root,
    cwd: root,
    ignore: `**/+(${ignorePath.join('|')})/**`,
    absolute: true
  }).forEach((filePath) => {
    let exportFuncs
    try {
      exportFuncs = require(filePath)
    } catch (err) {
      error(err)
      error(`error: require ${filePath}`)
      // 如果获取controller出错，则重置为默认方法
      exportFuncs = function (ctx) {
        this.status = 500
        ctx.body = 'Controller Require Error!'
      }
    }
    const pathRegexp = formatPath(filePath, root)
    getRoute(exportFuncs, (exportFun, ctrlpath) => {
      setRoute(app, {
        domain: '',
        method: exportFun.__method__ ? exportFun.__method__ : 'post',
        regular: exportFun.__regular__,
        suffix: exportFun.__suffix__,
        ctrlpath: ctrlpath,
        ctrl: exportFun
      }, options)
    }, [pathRegexp])
  })
  return async function rocketRouter (ctx, next) {
    await next()
  }
}
const formatPath = (filePath, root) => {
  let dir = root
  if (!path.isAbsolute(root)) {
    dir = path.join(process.cwd(), root)
  }
  // 修复windows下的\路径问题
  dir = dir.replace(/\\/g, '/')
  return filePath
    .replace(/\\/g, '/')
    .replace(dir, '')
    .split('.')[0]
}
const getRoute = (exportFuncs, cb, ctrlpath, curCtrlname) => {
  ctrlpath = ctrlpath || []
  // 如果当前设置了不是路由，则直接返回
  if (exportFuncs.__controller__ === false) {
    return
  }
  const totalCtrlname = curCtrlname ? ctrlpath.concat([curCtrlname]) : ctrlpath
  // 只允许3级路由层级
  if (ctrlpath.length > 3) {
    debug(`嵌套路由对象层级不能超过3级：${totalCtrlname.join('/')}`)
    return
  }
  // 如果是一个方法就直接执行cb
  if (typeof exportFuncs === 'function') {
    cb(exportFuncs, totalCtrlname)
  } else {
    // 否则进行循环递归查询
    for (const ctrlname in exportFuncs) {
      if (!exportFuncs.hasOwnProperty(ctrlname)) {
        continue
      }
      getRoute(exportFuncs[ctrlname], cb, totalCtrlname, ctrlname)
    }
  }
}
const setRoute = (app, config, options) => {
  const paths = []
  const ctrlpath = config.ctrlpath.join('/')
  // 加入当前路由
  paths.push(ctrlpath)
  // 如果当前路由配置方案为不跳转，则设置路由'/'为options.defaultPath路由
  if (options.defaultJump === false && ctrlpath === options.defaultPath) {
    paths.push('/')
  }
  // 如果设置了URL后缀，则统一添加后缀URL
  const suffix = config.suffix !== false && options.suffix || config.suffix
  if (suffix) {
    paths.push(ctrlpath + suffix)
  }
  // 如果当前路由是以index结尾，则把其父路由也加入路由
  if (config.ctrlpath.slice(-1)[0] === 'index') {
    const parpath = config.ctrlpath.slice(0, -1).join('/')
    paths.push(parpath)
    suffix && paths.push(parpath + suffix)
  }
  // 如果有regular则加入regular路由
  if (config.regular) {
    const reg = typeof config.regular === 'string' ? (ctrlpath + config.regular) : config.regular
    paths.push(reg)
  }
  // 如果没有配置method 则默认支持get及post
  let method = ['get', 'post']
  if (typeof config.method === 'string') {
    METHOD_ALLOWED.indexOf(config.method) > -1 && (method = [config.method])
  } else if (Array.isArray(config.method)) {
    config.method.every((item) => METHOD_ALLOWED.indexOf(item) > -1) && (method = config.method)
  }
  // 对每一个method，有定义时唯一，默认post/get
  method.forEach((_method) => {
    // 注入路由
    paths.forEach((pathItem) => {
      debug(`[${_method}]${pathItem}`)
      app.use(route[_method](pathItem, config.ctrl))
    })
  })
}
