require("ts-node").register()

var path = require('path')
global.appRoot = path.resolve(__dirname)

module.exports = require("./gatsby-config.ts")
