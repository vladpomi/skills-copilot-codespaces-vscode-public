// Create web server

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Load comments from file
var comments = JSON.parse(fs.readFileSync('comments.json'));

// Create server
http.createServer(function (req, res) {
    // Parse URL
    var url_parts = url.parse(req.url);

    // Return comments
    if (url_parts.pathname == '/comments') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comments));
    }

    // Add comment
    if (url_parts.pathname == '/comment' && req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var params = qs.parse(body);
            comments.push(params);
            fs.writeFileSync('comments.json', JSON.stringify(comments));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comments));
        });
    }
}).listen(8000);

console.log('Server running on port 8000');