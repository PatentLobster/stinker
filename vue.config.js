const externals = ['better-sqlite3', 'monaco-editor']
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  pluginOptions: {
      configureWebpack: {
          plugins: [
                      new MonacoWebpackPlugin({
                          features: ["!codelens", "!fontZoom", "!iPadShowKeyboard", "!snippets"],
                          languages: []
                      })
          ],
      },
    electronBuilder: {
        externals,
        nodeIntegration: true,
        disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
        mainProcessTypeChecking: false, // Manually enable type checking during webpack bundling for background file.
        enableRemoteModule: true,
        builderOptions: {
            appId: "io.itzik.brain.kit",
            productName: "Brain kit",
            files: ['**/*', 'build/icons/**/*'],
            extraResources: [
                {
                    from: './public',
                    to: 'public'
                }
            ],
            mac: {
                entitlements: "./build/entitlements.mac.plist",
                entitlementsInherit: "./build/entitlements.mac.plist",
                icon: './build/icons/icon.icns',
                category: "public.app-category.developer-tools",
                "hardenedRuntime": true
            },
        }
    },

  }
}