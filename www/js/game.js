(function () {
    var config = {
            BALL_DIAMETER: 50,
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
                game.stage.backgroundColor = '#f27d0c';
                game.load.image('ball', 'img/ballsm.png');
            }

            function create() {
                game.add.sprite(initX(), initY(), 'ball');
            }

            var states = {preload: preload, create: create};
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
                detectShaking(data);
            }

            function onError(err) {
                alert(err.code + ' - ' + err.message);
            }

            navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 1000});
        },

        getRandomNumber = function (max) {
            return Math.floor(Math.random() * max);
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


        detectShaking = function (data) {
            document.body.className = data.x > 10 || data.y > 10 ? 'shaking' : '';
        },

        showCurrentData = function (data) {
            printData(data.x, '#value-x', 'X');
            printData(data.y, '#value-y', 'Y');
            printData(data.z, '#value-z', 'Z');
        };

    if ('addEventListener' in document) {
        document.addEventListener('deviceready', function () {
            init();
        }, false);
    }
})();