function _Application() {

    this.FPS = 40;
    this.DISPLAY_RATE = 400;  // unixtime per second

    var PAGE_FETCH_URL = '/data/{start_time}/{end_time}';
    var QUERY_FETCH_URL = '/query/{uid}/{time}';
    var DATA_START_TIME = 1142300000;
    var DATA_END_TIME = 1148000000;
    var FETCH_TIME_BUFFER = 2000;
    var INITIAL_BUFFER = 1400;

    var _displayTime, _fetchTime;
    var _buffering = false;
    var _firstLoad = true;
    var _paused = false;
    var _loadingQuery = false;
    var _lastReset;

    var _descOverlayX, _descOverlayY, _descOverlayColor;

    /* Data interface */

    function setStartTime(stime) {
        var minResetInterval = 2000;
        var time = (new Date()).getTime();
        if (time - _lastReset < minResetInterval) {
            return;
        }
        _lastReset = time;

        _displayTime = stime;
        _fetchTime = stime - FETCH_TIME_BUFFER;
        _buffering = false;

        var renderer = Processing.getInstanceById('main_canvas');
        if (renderer) {
            renderer.reset();
        }
    }

    function pullNextPage() {
        _fetchTime += FETCH_TIME_BUFFER;
        _buffering = true;

        var url = PAGE_FETCH_URL
            .replace('{start_time}', _fetchTime)
            .replace('{end_time}', _fetchTime + FETCH_TIME_BUFFER);
					 
        $.get(url, {}, pullResponse).error(pullError);
    }

    function pullResponse(response, textStatus) {
        if (!_buffering) {
            // Request was interrupted, stop.
            return;
        }

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

    this.showQuery = function(uid, time, xC, yC, color) {
        _descOverlayX = xC;
        _descOverlayY = yC;
        _descOverlayColor = color.slice(2);

        var url = QUERY_FETCH_URL
            .replace('{uid}', uid)
            .replace('{time}', time);
                                          
        _loadingQuery = true;
        $.get(url, {}, queryResponse).error(queryError);
    }

    this.hideQuery = function() {
        $("#desc_overlay").hide();
        _loadingQuery = false;
    }

    function queryResponse(response, textStatus) {
        if (!_loadingQuery) {
            // Interrupted, cancel
            return;
        }
        response = JSON.parse(response);
        // Fake some data for now... fill this in later
        var disp = {text:response};
        disp.text = capFirst(disp.text);

        $("#desc_overlay").css('left', _descOverlayX + 'px');
        $("#desc_overlay").css('top', _descOverlayY + 'px');
        $("#desc_overlay").html(makeQuestionDiv(disp.text));
        $("#desc_overlay").show();

        _loadingQuery = false;
    }

    function queryError() {
        console.log("Error loading query");
    }

    function makeQuestionDiv(string) {
        // lolol, screw it, I'm tired...
        string = string.replace('Who', propSurround('Who'));
        string = string.replace('What', propSurround('What'));
        string = string.replace('When', propSurround('When'));
        string = string.replace('Where', propSurround('Where'));
        string = string.replace('Why', propSurround('Why'));
        string = string.replace('How', propSurround('How'));
        string = string.replace('Could', propSurround('Could'));
        string = string.replace('Should', propSurround('Should'));
        string = string.replace('Would', propSurround('Would'));

        string = '<table class="qwrap"><tr><td valign="middle" class="qwrap">' + string + '</tr></td></table>';

        html = $(string);
        $('.question', html).css('color', "#" + _descOverlayColor);
        return html;
    }

    function propSurround(prop) {
        return '<span class="question">' + prop + '</span>';
    }

    /* Rendering functions */

    this.getDisplayTime = function() {
        return _displayTime;
    }

    this.getWidth = function() { return $("#main_canvas").width(); }

    this.getHeight = function() { return $("#main_canvas").height(); }

    this.update = function() {
        if (_paused) {
            return;
        }

        if (_displayTime >= _fetchTime + FETCH_TIME_BUFFER) {
            if (_buffering) {
                // We're still trying to fetch the last frame!  Wait for it.
                $("#loading").show();
                return;
            }
            pullNextPage();
        }

        _displayTime += this.DISPLAY_RATE / this.FPS;
        _displayTime = Math.floor(_displayTime);
        var perc = Math.floor(((_displayTime - DATA_START_TIME) / (DATA_END_TIME - DATA_START_TIME)) * 100);
        $("#time_slider").slider('value', Math.floor(perc));
        setClockTime(_displayTime);
    }

    function setClockTime(time) {
        var date = new Date(time*1000);
        $("#time_text").html(date.toDateString());
    }

    $(window).resize(function() {
            var renderer = Processing.getInstanceById('main_canvas');
            if (renderer) {
                renderer.size(Application.getWidth(),
                              Application.getHeight());
            }
        });
    
    function initApplication() {
        // For demo purposes, you might want to hardcode a start time
        var startPerc = Math.floor(Math.random() * 70);
        var startTime = Math.floor((startPerc/100) * (DATA_END_TIME - DATA_START_TIME) + DATA_START_TIME);

        setStartTime(startTime);

        $("#time_slider").slider({
                range:"min",
                    min:0,
                    max:100,
                    value:startPerc,
                    step:1,
                    start:function(event, ui) {
                    _paused = true;
                    },
                    stop:function(event, ui) {
                    var perc = ui.value;
                    var time = Math.floor((perc/100) * (DATA_END_TIME - DATA_START_TIME) + DATA_START_TIME);
                    setStartTime(time);
                    _paused = false;
                },
                slide:function(event, ui) {
                    var perc = ui.value;
                    var time = Math.floor((perc/100) * (DATA_END_TIME - DATA_START_TIME) + DATA_START_TIME);
                    setClockTime(time);
                }
            });
    }

    $(initApplication);

}

var Application = new _Application();
