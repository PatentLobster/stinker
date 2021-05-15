import platformInfo from "./platform_info";
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(platformInfo.lowDbPath)
const lowdb = low(adapter)

lowdb.defaults({ snippets: [], user: {}, count: 0 })
    .write()

export default lowdb