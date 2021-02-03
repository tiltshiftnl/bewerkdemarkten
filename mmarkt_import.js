var https = require('https');
var fs = require('fs');

if (process.env.MMAP_API_KEY) {

var options = {
    host: 'makkelijkemarkt-api.amsterdam.nl',
    port: 443,
    headers: {
        'MmAppKey': process.env.MMAP_API_KEY
    },
    path: '/api/1.1.0/markt/',
    method: 'GET'
};
var body = '';

var req = https.request(options, function (res) {
 
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        body += chunk;
    });
    res.on('end', function() {
        fs.writeFile('./public/data/mmarkt.json', body, 'utf-8', function (err) {
            if (err) return console.log(err);
            console.log('./public/data/mmarkt.json');
          });
    })    
});

req.on('error', function (e) {
    console.error('problem with request: ' + e.message);
});
req.end()
} else {
    console.error("MMAP_API_KEY not set")
}
