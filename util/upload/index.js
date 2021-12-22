// 接收上传的excel文件，保存解析返回objects
const fs = require('fs')
const path = require('path')
const downPath = path.resolve(__dirname, '../../fileUpload')

async function saveFile (ctx) {
  const now = new Date().getTime()
  const file = ctx.request.files.file // 获取上传文件
  const reader = fs.createReadStream(file.path) // 创建可读流
  const filePath = `${downPath}/${now}-${file.name}`
  const upStream = fs.createWriteStream(filePath) // 创建可写流
  const getRes = await getFile(reader, upStream) // 等待数据存储完成
  if (!getRes) { // 没有问题
    return filePath
  }
}

function getFile (reader, upStream) {
  // eslint-disable-next-line promise/param-names
  return new Promise(function (result) {
    const stream = reader.pipe(upStream) // 可读流通过管道写入可写流
    stream.on('finish', function (err) {
      result(err)
      console.log(1111)
    })
  })
}

module.exports = {
  saveFile
}
