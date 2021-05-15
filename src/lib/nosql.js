import platformInfo from "./platform_info";
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(platformInfo.lowDbPath)
const lowdb = low(adapter)

export default lowdb