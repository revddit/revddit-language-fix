function getDistFolderName (forChromeDev, forFirefoxDev) {
  if (! forChromeDev && ! forFirefoxDev) {
    return "dist"
  } else if (forChromeDev) {
    return "dist-dev-chrome"
  } else {
    return "dist-dev-firefox"
  }
}
module.exports.getDistFolderName = getDistFolderName
