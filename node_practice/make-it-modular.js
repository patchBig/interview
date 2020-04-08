const mymodule = require('./mymodule.js')

var dir = process.argv[2]
var filterStr = process.argv[3]

mymodule(dir, filterStr, (err, list) => {
    if(err) {
        return console.error('There was an error:', err)
    }
    list.forEach(file => {
        console.log(file)
    });
})