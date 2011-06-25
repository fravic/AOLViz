function _Application() {

    /* Initialization */

    function initApplication() {
	$(document).keypress(function(e) {
		var button;
		switch(String.fromCharCode(e.which)) {
		default:
		    return;
		};
	    });

        $([]).preload();
    }

    $(initApplication);
}

var Application = new _Application();