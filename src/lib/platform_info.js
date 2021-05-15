import * as path from 'path'
import * as electron from 'electron'
const iniparser = require('iniparser');
// import   Store from "electron-store";
// const which = require('which')
// const settings = new Store();

import * as electronRemote from '@electron/remote'
const e = electronRemote ? electronRemote : electron
const p = electronRemote ? electronRemote.process : process
const platform = p.env.OS_OVERRIDE ? p.env.OS_OVERRIDE : p.platform
const testMode = !!p.env.TEST_MODE
const isDevEnv = !(e.app && e.app.isPackaged);
const isWindows = platform === 'win32'
const isMac = platform === 'darwin'
const easyPlatform = isWindows ? 'windows' : (isMac ? 'mac' : 'linux')
let windowPrefersDarkMode = false
if (electron.remote) {
    windowPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
}
// let which_php = settings.get('php_path')
// if (!isWindows && !which_php) {
//     which_php = which.sync = ('php')
//     settings.set('php_path', which_php)
// }
// const which_php = which.sync('node')


const updatesDisabled = !!p.env.BEEKEEPER_DISABLE_UPDATES

let userDirectory =  testMode ? './tmp' : e.app.getPath("userData")
const downloadsDirectory = testMode ? './tmp' : e.app.getPath('downloads')
const homeDirectory = testMode ? './tmp' : e.app.getPath('home')
const gitConfPath = path.join(e.app.getPath('home'), '/.gitconfig')
const gitUser = iniparser.parseSync(gitConfPath);
if (p.env.PORTABLE_EXECUTABLE_DIR) {
    userDirectory = path.join(p.env.PORTABLE_EXECUTABLE_DIR, 'beekeeper_studio_data')
}
const platformInfo = {
    isWindows, isMac,
    isLinux: !isWindows && !isMac,
    isSnap: p.env.ELECTRON_SNAP,
    isPortable: isWindows && p.env.PORTABLE_EXECUTABLE_DIR,
    isDevelopment: isDevEnv,
    isAppImage: p.env.DESKTOPINTEGRATION === 'AppImageLauncher',
    sshAuthSock: p.env.SSH_AUTH_SOCK,
    environment: process.env.NODE_ENV,
    env: {
        development: isDevEnv,
        test: testMode,
        production: !isDevEnv && !testMode && !p.env.WEBPACK_DEV_SERVER_URL
    },
    debugEnabled: !!process.env.DEBUG,
    platform: easyPlatform,
    darkMode: testMode? true : e.nativeTheme.shouldUseDarkColors || windowPrefersDarkMode,
    userDirectory,
    downloadsDirectory,
    homeDirectory,
    testMode,
    appDbPath: path.join(userDirectory, isDevEnv ? 'app-dev.db' : 'app.db'),
    lowDbPath: path.join(userDirectory, isDevEnv ? 'snippets-dev.json' : 'snippets.json'),

    // which_php,

    updatesDisabled,
    appVersion: testMode ? 'test-mode' : e.app.getVersion(),
    gitUser: gitUser ? gitUser.user : null
}

export default platformInfo