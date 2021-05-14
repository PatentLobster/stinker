const externals = ['better-sqlite3']
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  pluginOptions: {
      configureWebpack: {
          plugins: [
              new MonacoWebpackPlugin({
                  features: ["!codelens", "!fontZoom", "!iPadShowKeyboard", "!snippets"],
                  languages: []
              })
          ]
      },
    electronBuilder: {
        externals,
        nodeIntegration: true,
        disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
        mainProcessTypeChecking: false, // Manually enable type checking during webpack bundling for background file.
        enableRemoteModule: true
        // chainWebpackRendererProcess: (config) => {
        //     // Chain webpack config for electron renderer process only (won't be applied to web builds)
        //     config.
        // },
    }
  }
}