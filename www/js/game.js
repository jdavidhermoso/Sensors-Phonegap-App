(function () {
    var init = function () {
            initFastClick();

            navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 1000});
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

        onSuccess = function (data) {
            detectShaking(data);
            showCurrentData(data);
        },

        detectShaking = function (data) {
            document.body.className = data.x > 10 || data.y > 10 ? 'shaking' : '';
        },

        showCurrentData = function (data) {
            printData(data.x, '#value-x', 'X');
            printData(data.y, '#value-y', 'Y');
            printData(data.z, '#value-z', 'Z');
        },

        onError = function (err) {
            alert(err.code + ' - ' + err.message);

        };

    if ('addEventListener' in document) {
        document.addEventListener('deviceready', function () {
            init();
        }, false);
    }
})();