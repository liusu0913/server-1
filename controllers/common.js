// 接收上传的excel文件，保存解析返回objects
const xlsx = require('xlsx')
const fs = require('fs')
const path = require('path')
const downPath = path.resolve(__dirname, '../fileUpload')
const schema = require('~/validators/admin/system/user')
const service = require('~/service/admin/user')
const util = require('~/util')

exports.uploadFile = async (ctx) => {
  const getRes = await uploadExcelSrv(ctx)
  ctx.body = getRes
}

async function uploadExcelSrv (ctx) {
  const file = ctx.request.files.file // 获取上传文件
  const reader = fs.createReadStream(file.path) // 创建可读流
  const filePath = `${downPath}/${file.name}`
  const upStream = fs.createWriteStream(filePath) // 创建可写流
  const getRes = await getFile(reader, upStream) // 等待数据存储完成
  const datas = [] // 可能存在多个sheet的情况
  if (!getRes) { // 没有问题
    const workbook = xlsx.readFile(filePath)
    const sheetNames = workbook.SheetNames // 返回 ['sheet1', ...]
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      const data = xlsx.utils.sheet_to_json(worksheet)
      createUser(data)
      datas.push(data)
    }
    return {
      status: true,
      datas
    }
  } else {
    return {
      status: false,
      msg: '上传文件错误'
    }
  }
}

function getFile (reader, upStream) {
  // eslint-disable-next-line promise/param-names
  return new Promise(function (result) {
    const stream = reader.pipe(upStream) // 可读流通过管道写入可写流
    stream.on('finish', function (err) {
      result(err)
    })
  })
}

async function createUser (data) {
  const keyMap = {
    姓名: 'name',
    工号: 'jobId',
    手机号: 'phone',
    机构代码: 'companyId',
    机构地址: 'company',
    职位: 'title'
  }
  data.forEach(async user => {
    const userInfo = {}
    Object.keys(user).forEach(key => {
      userInfo[keyMap[key]] = `${user[key]}`
    })
    await util.validator.check(schema, 'create', userInfo)
    const res = await service.create(userInfo)
    console.log(res)
  })
}
