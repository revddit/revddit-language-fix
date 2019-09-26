const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const DisableOutputWebpackPlugin = require("disable-output-webpack-plugin");
const COMMON = require("./webpack.common.js")

const mode = process.env.NODE_ENV;
const distPath = path.join(__dirname, "manifest", COMMON.getDistFolderName(process.env.FORCHROMEDEV, process.env.FORFIREFOXDEV))

function modify(buffer) {
  // copy-webpack-plugin passes a buffer
  // this line, buffer.toString(), causes this error if this filename ends in babel.js:
  //     Cannot find module 'core-js/modules/es.object.to-string'
  // maybe babel converts it incorrectly?
  var manifest = JSON.parse(buffer.toString());
  manifest.permissions.push("http://localhost/*")
  manifest.content_scripts[0].matches.push("http://localhost/*")
  if (process.env.FORFIREFOXDEV) {
    manifest.browser_specific_settings = {
      "gecko": {
        "id": "revddit-ext@revddit.com"
      }
    }
  }
  // pretty print to JSON with two spaces
  return JSON.stringify(manifest, null, 2);
}


module.exports = {
  mode,
  entry: './src/content.js', // some js file, doesn't matter what it is
  plugins: [
    new DisableOutputWebpackPlugin(),
    new CopyWebpackPlugin([
    {
      from: "./src/manifest.json",
      to:   "./manifest.json",
      // from https://stackoverflow.com/a/54700817/2636364
      transform (content, path) {
        if (mode !== "development") {
          return content
        } else {
          return modify(content)
        }
      }
    }])
  ],
  output: { path: distPath }
}
