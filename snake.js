const Snake = function(seedrandom, blockhash, startTime) {

    const seed = blockhash + '_' + startTime;

    const rng = new seedrandom(seed);

    console.log('new Snake(' + blockhash + ', ' + startTime + ') // ' + rng());

};

try {
    module.exports = Snake;
} catch (e) {}