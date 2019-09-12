var forever = require('forever-monitor');

var child = new(forever.Monitor)('main.js', {
    max: Number.MAX_SAFE_INTEGER,
    silent: false,
    watch: false,
});

child.on('exit', function() {
    console.error(new Date, 'Server is crashing too much. Crash count: ', child.times);
});

child.on('restart', function() {
    console.error(new Date, 'Restarting server due to a crash. Restart count: ', child.times);
});

child.start();

setInterval(function() {
    console.info(new Date, 'Server running. Restart count: ', child.times);
}, 15000);