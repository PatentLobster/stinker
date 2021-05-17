const externals = ['better-sqlite3', 'monaco-editor']
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
    configureWebpack: {
        devtool: 'source-map',
        plugins: [
            new MonacoWebpackPlugin({
                features: ["!codelens", "!fontZoom", "!iPadShowKeyboard", "!snippets"],
                languages: []
            })
        ],
    },
    pluginOptions: {
    electronBuilder: {
        externals,
        nodeIntegration: true,
        disableMainProcessTypescript: false, // Manually disable typescript plugin for main process. Enable if you want to use regular js for the main process (src/background.js by default).
        mainProcessTypeChecking: false, // Manually enable type checking during webpack bundling for background file.
        enableRemoteModule: true,
        builderOptions: {
            appId: "io.itzik.stinker",
            productName: "Stinker",
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