const fs = require('fs')
const path = require('path')

module.exports = function(directoryName, filenameExtension, callback) {
    fs.readdir(directoryName, (err, files) => {
        if(err) {
            return callback(err)
        }
        let extension = '.' + filenameExtension;
        let filterFiles = []
        files.forEach(file => {
            if(path.extname(file) === extension) {
                filterFiles.push(file)
            }
        })
        callback(null, filterFiles)
    })
}