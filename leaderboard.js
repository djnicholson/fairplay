const crypto = require('crypto');
const fs = require('fs');
const seedrandom = require('seedrandom');

const Snake = require('./snake');

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

    this.getSeed = function() {
        const startTime = (new Date).getTime();
        const blockHash = crypto.createHmac('sha256', serverSecret)
            .update(startTime + '')
            .digest('hex');
        return [blockHash, startTime];
    };

};

module.exports = LeaderBoard;