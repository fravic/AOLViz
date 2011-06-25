function _Application() {

    this.FPS = 40;

    var PAGE_FETCH_URL = '/data/{start_time}/{end_time}';
    var FETCH_TIME_BUFFER = 1000;

    var _snakes = {};
    var _displayTime = 0;
    var _displayRate = 1000;  // unixtime per second
    var _fetchTime = -FETCH_TIME_BUFFER;
    var _buffering = false;

    /* Data interface */

    function pullNextPage() {
        _buffering = true;

        var url = PAGE_FETCH_URL
            .replace('{start_time}', 0)
            .replace('{end_time}', 1);
					 
        $.get(url, {}, pullResponse).error(pullError);
    }

    function pullResponse(response, textStatus) {
        response = JSON.parse(response);
        $.each(response, function(idx, data) {
                var userSnake = _snakes[idx];
                if (!userSnake) {
                    _snakes[idx] = userSnake =
                        new _Snake(data.s, data.a, data.w);
                }
                $.each(data.q, function(idx, query) {
                        var snakeNode = new _SnakeNode();
                        snakeNode.setParent(userSnake);
                        userSnake.addNode(snakeNode);
                    });
            });

        _buffering = false;
        $("#loading").hide()
    }

    function pullError() {
        console.log("Error pulling new data");
    }

    /* Rendering functions */

    this.getDisplayTime = function() {
        return _displayTime;
    }

    this.getWidth = function() { return $("#main_canvas").width(); }

    this.getHeight = function() { return $("#main_canvas").height(); }

    this.getSnakes = function() { return _snakes; }

    this.update = function() {
        if (_displayTime >= _fetchTime + FETCH_TIME_BUFFER) {
            if (_buffering) {
                // We're still trying to fetch the last frame!  Wait for it.
                $("#loading").show();
                return;
            }
            pullNextPage();
            _fetchTime = _displayTime;
        }

        _displayTime += _displayRate / this.FPS;

        $.each(_snakes, function(idx, snake) {
                snake.update();
            });
    }

    /* Initialization */

    function initApplication() {
        $(document).keypress(function(e) {
                var button;
                switch(String.fromCharCode(e.which)) {
                default:
                    return;
                };
            });

        var canvas = $("#main_canvas").get(0);
        var processing = new Processing(canvas, _SnakeRenderer);

        Application.update();
    }

    $(initApplication);
}

var Application = new _Application();
