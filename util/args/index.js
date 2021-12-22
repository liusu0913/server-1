const parseArg = function parseArg () {
  const argvs = process.argv
  const result = {}

  const REG = /^--[a-zA-Z0-9]+=[a-zA-Z0-9]+$/

  argvs.map(function (item) {
    if (!REG.test(item)) return

    const arr = item.split('=')
    const key = arr[0].slice(2)

    result[key] = arr[1]
  })

  return result
}

module.exports = {
  parseArg
}
