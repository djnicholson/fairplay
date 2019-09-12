const Snake = function(seedrandom, blockhash, startTime) {

    this.Interval = 100;

    this.Directions = {
        UP: 0,
        DOWN: 1,
        LEFT: 2,
        RIGHT: 3,
    };

    const seed = blockhash + '_' + startTime;

    const rng = seedrandom(seed);

    const width = 20;
    const height = 10;
    const initialSnakeLength = 5;

    const snake = [];
    for (let i = 0; i < initialSnakeLength; i++) {
        snake.push([
            Math.round(width / 2) + i,
            Math.round(height / 2)
        ]);
    }

    let direction = this.Directions.RIGHT;

    let food = [0, 0];

    this.alive = true;

    const placeFood = function() {
        let success = false;
        while (!success) {
            food[0] = Math.floor(rng() * width);
            food[1] = Math.floor(rng() * height);
            success = true;
            for (let i = 0; i < snake.length; i++) {
                if ((snake[i][0] === food[0]) && (snake[i][1] === food[1])) {
                    success = false;
                }
            }
        }
    }

    placeFood();

    this.drawToConsole = function() {
        for (let y = 0; y < height; y++) {
            let line = '';
            for (let x = 0; x < width; x++) {
                let character = '-';
                if ((food[0] === x) && (food[1] === y)) {
                    character = 'o';
                } else {
                    for (let i = 0; i < snake.length; i++) {
                        if ((snake[i][0] === x) && (snake[i][1] === y)) {
                            if (i === snake.length - 1) {
                                character = '8';
                            } else {
                                character = 'X';
                            }
                        }
                    }
                }

                line += character;
            }

            console.log(line + '   ' + y);
        }

        console.log('Direction: ' + direction);
        console.log('Score: ' + snake.length);
    }

    let that = this;
    this.tick = function() {
        if (that.alive) {
            const oldHead = snake[snake.length - 1];
            const newHead = [oldHead[0], oldHead[1]];
            if (direction === this.Directions.UP) {
                newHead[1] = (height + newHead[1] - 1) % height;
            } else if (direction === this.Directions.DOWN) {
                newHead[1] = (newHead[1] + 1) % height;
            } else if (direction === this.Directions.LEFT) {
                newHead[0] = (width + newHead[0] - 1) % width;
            } else if (direction === this.Directions.RIGHT) {
                newHead[0] = (newHead[0] + 1) % width;
            }

            let ateFood = false;
            for (let i = 0; i < snake.length; i++) {
                if ((snake[i][0] === newHead[0]) && (snake[i][1] === newHead[1])) {
                    that.alive = false;
                }

                if ((snake[i][0] === food[0]) && (snake[i][1] === food[1])) {
                    ateFood = true;
                }
            }

            if (that.alive) {
                snake.push(newHead);
                if (ateFood) {
                    placeFood();
                } else {
                    snake.shift();
                }
            }
        }
    }

    this.setDirection = function(d) {
        if ((d === this.Directions.UP) && (direction !== this.Directions.DOWN)) {
            direction = this.Directions.UP;
        } else if ((d === this.Directions.DOWN) && (direction !== this.Directions.UP)) {
            direction = this.Directions.DOWN;
        } else if ((d === this.Directions.LEFT) && (direction !== this.Directions.RIGHT)) {
            direction = this.Directions.LEFT;
        } else if ((d === this.Directions.RIGHT) && (direction !== this.Directions.LEFT)) {
            direction = this.Directions.RIGHT;
        }
    }

};

try {
    module.exports = Snake;
} catch (e) {}