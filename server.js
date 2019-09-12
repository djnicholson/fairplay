const fs = require('fs');
const http = require('http');
const https = require('https');

const LeaderBoard = require('./leaderboard');

const Server = function(port, httpsPort) {

    const clientHtml = fs.readFileSync('client.html') + '';
    const snakeJs = fs.readFileSync('snake.js') + '';
    const manifestJson = fs.readFileSync('manifest.json') + '';

    const leaderBoard = new LeaderBoard();

    const requestHandler = function(request, response) {
        console.log(new Date(), ' Received request for ' + request.url);
        if (request.url === '/') {
            response.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': clientHtml.length,
            });
            response.write(clientHtml);
            response.end();
        } else if (request.url === '/snake.js') {
            response.writeHead(200, {
                'Content-Type': 'application/javascript',
                'Content-Length': snakeJs.length,
            });
            response.write(snakeJs);
            response.end();
        } else if (request.url === '/manifest.json') {
            response.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': manifestJson.length,
            });
            response.write(manifestJson);
            response.end();
        } else if (request.url.startsWith('/new-game')) {
            let responseText = JSON.stringify(leaderBoard.getSeed());
            response.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': responseText.length,
            });
            response.write(responseText);
            response.end();
        } else if ((request.url === '/submit-score') && (request.method === 'POST')) {
            let body = ''
            request.on('data', function(data) { body += data });
            request.on('end', function() {
                try {
                    leaderBoard.submitScore(JSON.parse(body));
                } catch (e) {
                    console.error(e);
                }
                responseText = '{}';
                response.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Content-Length': responseText.length,
                });
                response.write(responseText);
                response.end();
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    };

    const httpsOptions = {
        key: fs.readFileSync('ssl_key.test'),
        cert: fs.readFileSync('ssl_cert.test'),
        passphrase: 'password'
    };

    const httpServer = http.createServer(requestHandler);
    const httpsServer = https.createServer(httpsOptions, requestHandler);

    httpServer.listen(port, function() {
        console.log(new Date(), ' HTTP server is listening on port ' + port);
    });

    httpsServer.listen(httpsPort, function() {
        console.log(new Date(), ' HTTPS server is listening on port ' + httpsPort);
    });
};

module.exports = Server;