const { v4: uuidv4 } = require('uuid')
const md5 = require('md5')

const createUUID = () => {
  return uuidv4()
}

const createUID = (string) => {
  const uuid = createUUID()
  return md5(uuid)
}

module.exports = {
  createUUID,
  createUID
}
