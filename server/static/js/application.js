function _Application() {

    this.FPS = 40;
    this.DISPLAY_RATE = 50;  // unixtime per second

    var PAGE_FETCH_URL = '/data/{start_time}/{end_time}';
    var START_TIME = 1141264807;
    var FETCH_TIME_BUFFER = 1000;
    var INITIAL_BUFFER = 600;

    var _displayTime = START_TIME;
    var _fetchTime = START_TIME - FETCH_TIME_BUFFER;
    var _buffering = false;
    var _firstLoad = true;

    /* Data interface */

    function pullNextPage() {
        _fetchTime += FETCH_TIME_BUFFER;
        _buffering = true;

        var url = PAGE_FETCH_URL
            .replace('{start_time}', _fetchTime)
            .replace('{end_time}', _fetchTime + FETCH_TIME_BUFFER);
					 
        $.get(url, {}, pullResponse).error(pullError);
    }

    function pullResponse(response, textStatus) {
        response = JSON.parse(response);
        $.each(response, function(userid, data) {
                var renderer = Processing.getInstanceById('main_canvas');
                renderer.addSnakeIfNotExists(userid, data.s, data.a, data.w);
                $.each(data.q, function(idx, query) {
                        renderer.addSnakeNode(userid, query.t, query.s, query.c[0], query.c[1], query.c[2]);
                    });
            });

        _buffering = false;

        if (_firstLoad) {
            _firstLoad = false;
            _displayTime += INITIAL_BUFFER;
        }
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

    this.update = function() {
        if (_displayTime >= _fetchTime + FETCH_TIME_BUFFER) {
            if (_buffering) {
                // We're still trying to fetch the last frame!  Wait for it.
                $("#loading").show();
                return;
            }
            pullNextPage();
        }

        _displayTime += this.DISPLAY_RATE / this.FPS;
    }

    /* Initialization */

    function initApplication() {
    }

    $(initApplication);
}

var Application = new _Application();
