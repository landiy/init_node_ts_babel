require("@babel/register")({extensions: ['.js', '.ts']})

module.exports = require('./src/server.ts')