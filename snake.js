const Snake = function(blockhash, startTime) {

    const seed = blockhash + '_' + startTime;

    alert('new Snake(' + blockhash + ', ' + startTime + ')');

};

try {
    module.exports = Snake;
} catch (e) {}