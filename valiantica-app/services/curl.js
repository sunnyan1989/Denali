var http = require('http');

function download(url, callback) {
    //console.log(url);
    http.get(url, function(res) {
        var data = "";
        res.on('data', function(chunk) {
            ///console.log(chunk);
            data += chunk;
        });
        res.on("end", function() {
            callback(data);
        });
    }).on("error", function() {
        callback(null);
    });
}

exports.download = download;