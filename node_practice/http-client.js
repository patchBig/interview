const http = require('http');
let url = process.argv[2]
http.get(url, res => {
    res.setEncoding('utf8');
    res.on('data', chunk => {
        console.log(chunk);
    })
})