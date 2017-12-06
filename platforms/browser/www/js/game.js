(function () {
    var config = {
            BALL_DIAMETER: 50,
            speedX: 0,
            speedY: 0,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
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
            }

            function create() {
                ball = game.add.sprite(initX(), initY(), 'ball');
                game.physics.arcade.enable(ball);
            }

            function update() {
                ball.body.velocity.y = (config.speedY * 40);
                ball.body.velocity.x = (config.speedX * -40clear);
            }

            var states = {preload: preload, create: create, update: update};
            var game = new Phaser.Game(config.width, config.height, Phaser.CANVAS, 'phaser', states);
        },

        initX = function () {
            return getRandomNumber(config.width - config.BALL_DIAMETER);
        },

        initY = function () {
            return getRandomNumber(config.height - config.BALL_DIAMETER);
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
        };

    getRandomNumber = function (max) {
        return Math.floor(Math.random() * max);
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
        restart = function () {
            document.location.reload(true);
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
        };

    if ('addEventListener' in document) {
        document.addEventListener('deviceready', function () {
            init();
        }, false);
    }
})();