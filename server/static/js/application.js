function _Application() {

    var _snakes = [];

    this.getWidth = function() { return $("#main_canvas").width(); }

    this.getHeight = function() { return $("#main_canvas").height(); }

    this.getSnakes = function() { return _snakes; }

    this.update = function() {
	
    }

    /* Data handling */

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

	var snake = new _Snake();
	snake.addNode(new _SnakeNode({x:50, y:50}, 5, {r:255, g:0, b:0}, {r:0, g:0, b:0}));
	_snakes.push(snake);
    }

    $(initApplication);
}

var Application = new _Application();
