function _Application() {

    this.snakes = [];

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
    }

    $(initApplication);
}

var Application = new _Application();