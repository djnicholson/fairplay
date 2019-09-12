const fs = require('fs');
const http = require('http');

const LeaderBoard = require('./leaderboard');


const Server = function(port) {

    const clientHtml = fs.readFileSync('client.html') + '';
    const snakeJs = fs.readFileSync('snake.js') + '';

    const leaderBoard = new LeaderBoard();

    const httpServer = http.createServer(function(request, response) {
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
        } else if (request.url === '/new-game') {
            let responseText = JSON.stringify(leaderBoard.getSeed());
            response.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': responseText.length,
            });
            response.write(responseText);
            response.end();
        } else {
            response.writeHead(404);
            response.end();
        }
    });

    httpServer.listen(port, function() {
        console.log(new Date(), ' Server is listening on port ' + port);
    });
};

module.exports = Server;