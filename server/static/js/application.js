function _Application() {

    var PAGE_FETCH_URL = '/data/{start_time}/{end_time}';
    var FETCH_TIME_BUFFER = 100;

    var _snakes = {};
    var _displayTime = 0;
    var _displayRate = 1;
    var _fetchTime = -FETCH_TIME_BUFFER;

    /* Data interface */

    function pullNextPage() {
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
        _displayTime += _displayRate;

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

        pullNextPage();
        Application.update();
    }

    $(initApplication);
}

var Application = new _Application();
