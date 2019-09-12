const crypto = require('crypto');
const fs = require('fs');
const seedrandom = require('seedrandom');

const Snake = require('./snake');

const AcceptableClockSkewInMs = 1000 * 30;

const LeaderBoard = function() {

    let serverSecret = '';
    try {
        serverSecret = (fs.readFileSync('serverSecret.txt') + '').trim();
    } catch (e) {
        console.warn('Creating new server secret...');
        serverSecret = '';
        for (var i = 0; i < 32; i++) {
            serverSecret += String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 26));
        }

        fs.writeFileSync('serverSecret.txt', serverSecret);
    }

    const getScore = function(submission) {
        const expectedEndTime = (new Date).getTime();
        const startTime = submission.startTime;
        const blockHash = crypto.createHmac('sha256', serverSecret).update(startTime + '').digest('hex');
        const history = submission.history || [];
        if (blockHash !== submission.blockHash) {
            console.warn('Cheater: Wrong blockhash: ' + JSON.stringify(submission));
            return 0;
        }

        const snake = new Snake(seedrandom, blockHash, startTime);

        let endTime = startTime;
        for (let i = 0; i < history.length; i++) {
            const historyItem = history[i];
            console.log(historyItem);
            if (snake.alive && historyItem.t) {
                for (let j = 0; j < historyItem.t; j++) {
                    if (snake.alive) {
                        snake.tick();
                        endTime += snake.Interval;
                        if (endTime - AcceptableClockSkewInMs > expectedEndTime) {
                            console.warn('Cheater: History too long: ' + JSON.stringify(submission));
                            return 0;
                        }
                    }
                }

                snake.drawToConsole();

                if (snake.alive && (historyItem.d !== null)) {
                    snake.setDirection(historyItem.d);
                }
            }
        }

        if (endTime + AcceptableClockSkewInMs < expectedEndTime) {
            console.warn('Cheater: History not submitted soon enough after start of play: ' + JSON.stringify(submission));
            return 0;
        }

        return snake.getScore();
    };

    this.getSeed = function() {
        const startTime = (new Date).getTime();
        const blockHash = crypto.createHmac('sha256', serverSecret).update(startTime + '').digest('hex');
        return [blockHash, startTime];
    };

    this.submitScore = function(submission) {
        console.log(submission);
        console.log('*** Score: ' + getScore(submission));
    };

};

module.exports = LeaderBoard;