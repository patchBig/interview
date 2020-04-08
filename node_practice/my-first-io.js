const fs = require('fs')

const dir = process.argv[2]

console.log(fs.readFileSync(dir).toString().split('\n').length - 1)