'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const { ipcMain } = require('electron')
import installExtension /*{ VUEJS_DEVTOOLS }*/ from 'electron-devtools-installer'
import * as path from "path";
const isDevelopment = process.env.NODE_ENV !== 'production'
require('@electron/remote/main').initialize()
const Store = require('electron-store');
Store.initRenderer()
import { autoUpdater } from "electron-updater";
let win;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

app.setAsDefaultProtocolClient('stinker');
const showProcessArgv = () => console.log('Process args: %o', process.argv);
if (app.isReady()) showProcessArgv();

ipcMain.on('app_loaded', (event, arg) => {
  const argv = showProcessArgv()
  event.reply('asynchronous-reply', argv)
})

ipcMain.on('updater-ready', () => {
  autoUpdater.checkForUpdates()
})

autoUpdater.on('update-available', () => {
  win.webContents.send('update-available');
})

ipcMain.on('download-update', () => {
    autoUpdater.downloadUpdate()
})

autoUpdater.on('update-downloaded', () => {
    win.webContents.send('update-downloaded');
})

ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
})


 async function createWindow() {
  // Create the browser window.
   win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.resolve(__static, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
    await autoUpdater.checkForUpdatesAndNotify();
  } else {
    await createProtocol('app')
    // Load the index.html when not in development
    await win.loadURL('app://./index.html');
    await autoUpdater.checkForUpdatesAndNotify();
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async() => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) await createWindow()
})

app.on('open-url', function (event, url) {

  event.preventDefault
  win.webContents.send('stinker_invoked', url)

});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  showProcessArgv
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await  installExtension({
        id: 'ljjemllljcmogpfapbkkighbhhppjdbg', //Vue Devtools beta
        electron: '>=1.2.1'
      })
      // await  installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  await createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
