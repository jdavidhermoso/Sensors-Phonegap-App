(function () {
    var game,
        graphics,
        config = {
            level: 0,
            BALL_DIAMETER: 50,
            speedX: 0,
            speedY: 0,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            score: 0,
            ballSpeed: 50
        },
        init = function () {
            initFastClick();
            watchSensors();
            startGame();
        },

        startGame = function () {
            function preload() {
                game.physics.startSystem(Phaser.Physics.ARCADE);

                game.stage.backgroundColor = '#17aa40';
                game.load.image('ball', 'img/ballsm.png');
                game.load.image('goal', 'img/goaltop.png');
            }

            function create() {
                scoreText = game.add.text(16, 16, config.score, {
                    fontSize: '100px',
                    fill: '#757676'
                });

                ball = game.add.sprite(initX(), initY(), 'ball');
                goal = game.add.sprite((config.width / 2) - (200 / 2), 0, 'goal');
                game.physics.arcade.enable(ball);
                game.physics.arcade.enable(goal);

                drawGoalLine();

                ball.body.collideWorldBounds = true;
                ball.body.onWorldBounds = new Phaser.Signal();
                ball.body.onWorldBounds.add(function () {
                    if (isBallOut()) {
                        ballOut();
                    }
                });
            }

            function update() {
                var speedLevel = (config.ballSpeed + (config.level * 5));

                ball.body.velocity.y = (config.speedY * speedLevel);
                ball.body.velocity.x = (config.speedX * (-1 * speedLevel));

                game.physics.arcade.overlap(ball, goal, score, null, this);
            }


            var states = {preload: preload, create: create, update: update};
            game = new Phaser.Game(config.width, config.height, Phaser.CANVAS, 'phaser', states);
        },

        isBallOut = function () {
            var lineStartY = line.start.y;
            return ball.position.y - (config.BALL_DIAMETER / 2) < lineStartY;
        },

        drawGoalLine = function () {
            graphics = game.add.graphics(0, 0),
                goalBottom = goal.position.y + goal.height - 5;
            line = new Phaser.Line(0, goalBottom, config.width, goalBottom);
            graphics.lineStyle(5, 0xffffff, 1);
            graphics.moveTo(line.start.x, line.start.y);
            graphics.lineTo(line.end.x, line.end.y);
            graphics.endFill();

        },

        initX = function () {
            return (config.width / 2) - (config.BALL_DIAMETER / 2);
        },

        initY = function () {
            return getRandomNumber(config.height / 2 - config.BALL_DIAMETER, config.height - config.BALL_DIAMETER);
        },

        watchSensors = function () {
            function onSuccess(data) {
                registerDirection(data);
                showCurrentData(data);
            }

            function onError(err) {
                alert(err.code + ' - ' + err.message);
            }

            navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});
        },

        registerDirection = function (data) {
            config.speedX = data.x;
            config.speedY = data.y;
        },

        getRandomNumber = function (min, max) {
            return Math.floor(Math.random() * max) + min;
        },

        initFastClick = function () {
            FastClick.attach(document.body);
        },

        printData = function (data, element, axis) {
            document.querySelector(element).innerHTML = axis + ': ' + roundData(data);
        },
        roundData = function (data) {
            return Math.round(data * 100) / 100;
        },

        restartBall = function () {
            ball.position.x = initX();
            ball.position.y = initY();
        },

        showCurrentData = function (data) {
            printData(data.x, '#value-x', 'X');
            printData(data.y, '#value-y', 'Y');
            printData(data.z, '#value-z', 'Z');
            printSpeed('x', config.speedX);
            printSpeed('y', config.speedY);
        },

        printSpeed = function (axis, speed) {
            document.querySelector('#value-speed-' + axis).innerHTML = roundData(speed);
        },

        score = function () {
            increaseScore();
            restartBall();
        },

        ballOut = function () {
            decreaseScore();
            restartBall();
        },

        increaseScore = function () {
            config.score += 1;
            scoreText.text = config.score;
            config.level += 1;
        },

        decreaseScore = function () {
            config.score -= 1;
            scoreText.text = config.score;
        };

    if ('addEventListener' in document) {
        document.addEventListener('deviceready', function () {
            init();
        }, false);
    }
})();