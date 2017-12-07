(function () {
    var game,
        config = {
            BALL_DIAMETER: 50,
            speedX: 0,
            speedY: 0,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
            score: 0,
        },
        init = function () {
            initFastClick();
            watchSensors();
            startGame();
        },

        startGame = function () {
            function preload() {
                game.physics.startSystem(Phaser.Physics.ARCADE);

                game.stage.backgroundColor = '#f27d0c';
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
                ball.body.collideWorldBounds = true;
                ball.body.onWorldBounds = new Phaser.Signal();
                ball.body.onWorldBounds.add(function () {
                    if (ball.position.y === game.world.y) {
                        ballOut();
                    }
                });
            }

            function update() {
                ball.body.velocity.y = (config.speedY * 150);
                ball.body.velocity.x = (config.speedX * -150);

                game.physics.arcade.overlap(ball, goal, score, null, this);
            }

            var states = {preload: preload, create: create, update: update};
            game = new Phaser.Game(config.width, config.height, Phaser.CANVAS, 'phaser', states);
        },

        initX = function () {
            return (config.width / 2) - (config.BALL_DIAMETER / 2);
        },

        initY = function () {
            return getRandomNumber(config.height / 2 - config.BALL_DIAMETER, config.height - config.BALL_DIAMETER);
        },

        watchSensors = function () {
            function onSuccess(data) {
                //detectShaking(data);
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
        detectShaking = function (data) {
            document.body.className = data.x > 10 || data.y > 10 ? 'shaking' : '';
            if (data.x > 10 || data.y > 10) {
                setTimeout(restart, 1000);
            }
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

        ballOut = function() {
            decreaseScore();
            restartBall();
        };

        increaseScore = function () {
            config.score += 1;
            scoreText.text = config.score;
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