function _Application() {

    this.FPS = 40;

    var PAGE_FETCH_URL = '/data/{start_time}/{end_time}';
    var FETCH_TIME_BUFFER = 1000;

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
        $.each(response, function(userid, data) {
                var renderer = Processing.getInstanceById('main_canvas');
                renderer.addSnakeIfNotExists(userid, data.s, data.a, data.w);
                $.each(data.q, function(idx, query) {
                        renderer.addSnakeNode(userid, data.t, data.s, data.c, data.c);
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
    }

    /* Initialization */

    function initApplication() {
    }

    $(initApplication);
}

var Application = new _Application();
