import * as path from 'path'
import * as electron from 'electron'
const iniparser = require('iniparser');
import { sync } from "execa";
import stripAnsi from "strip-ansi";
const defaultShell = process.env.SHELL || "/bin/bash";

const args = ["-ilc", 'echo -n "_SHELL_ENV_DELIMITER_"; env; echo -n "_SHELL_ENV_DELIMITER_"; exit'];
const env = {
  // Disables Oh My Zsh auto-update thing that can block the process.
  DISABLE_AUTO_UPDATE: "true"
};
const parseEnv = (env) => {
  env = env.split("_SHELL_ENV_DELIMITER_")[1];
  const ret = {};

  for (const line of stripAnsi(env)
    .split("\n")
    .filter((line) => Boolean(line))) {
    const [key, ...values] = line.split("=");
    ret[key] = values.join("=");
  }

  return ret;
};

const shellEnv = () => {
  try {
    const { stdout } = sync(defaultShell, args, { env });
    return parseEnv(stdout);
  } catch (error) {
    return process.env;
  }
}

const which_php = () => {
  try {
    const { stdout } = sync('which', ['php'], );
    return stdout;
  } catch (error) {
    return process.env;
  }
}

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

const updatesDisabled = !!p.env.BEEKEEPER_DISABLE_UPDATES

let userDirectory =  testMode ? './tmp' : e.app.getPath("userData")
const downloadsDirectory = testMode ? './tmp' : e.app.getPath('downloads')
const homeDirectory = testMode ? './tmp' : e.app.getPath('home')
const tempDirectory = e.app.getPath('temp');
const appDirectory = e.app.getPath('appData');
const gitConfPath = path.join(e.app.getPath('home'), '/.gitconfig')
const gitUser = iniparser.parseSync(gitConfPath);
if (p.env.PORTABLE_EXECUTABLE_DIR) {
    userDirectory = path.join(p.env.PORTABLE_EXECUTABLE_DIR, 'stinker_beta')
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
    tempDirectory,
    appDirectory,
    testMode,
    appDbPath: path.join(userDirectory, isDevEnv ? 'app-dev.db' : 'app.db'),
    lowDbPath: path.join(userDirectory, isDevEnv ? 'snippets-dev.json' : 'snippets.json'),

    which_php: which_php(),
    shellEnv: shellEnv(),

    updatesDisabled,
    appVersion: testMode ? 'test-mode' : e.app.getVersion(),
    gitUser: gitUser ? gitUser.user : null
}

export default platformInfo