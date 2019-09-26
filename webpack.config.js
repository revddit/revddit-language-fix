const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ExtensionReloader  = require("webpack-extension-reloader")
const COMMON = require("./webpack.common.js")

const mode = process.env.NODE_ENV
const distFolder = COMMON.getDistFolderName(process.env.FORCHROMEDEV, process.env.FORFIREFOXDEV)
const distPath = path.join(__dirname, distFolder)
const manifestPath = path.join(__dirname,
                               'manifest',
                               distFolder,
                               'manifest.json')

const plugins = [
  new CopyWebpackPlugin([
    { from: manifestPath },
    { from: "./src/icons", to:'icons/' }
  ])
]

if (mode === 'development') {
  plugins.push(new ExtensionReloader({
    port: 9123,
    reloadPage: true,
    manifest: manifestPath
  }))
}

module.exports = {
  mode,
  devtool: "inline-source-map",
  entry: {
    background: './src/background.js',
    content: './src/content.js'
  },
  output: {
    publicPath: ".",
    path: distPath,
    filename: "[name].js"
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [require("@babel/preset-env")]
          }
        }
      }
    ]
  }
}
