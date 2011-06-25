function _SnakeRenderer(processing) {

    processing.setup = function() {
	processing.background(255, 255, 255);
    }

    processing.draw = function() {
	// We'll use processing as the run-loop for now
	// A bit messy, but this is a hackathon!
	Application.update();

	// Resize if necessary
	processing.size(Application.getWidth(), Application.getHeight());

	$.each(Application.getSnakes(), function(idx, snake) {
		var snakeNodes = snake.getNodes();
		$.each(snakeNodes, function(idx, node) {
			processing.fill(node.color.r, node.color.g, node.color.b);
			processing.stroke(node.stroke.r, node.stroke.g, node.stroke.b);
			processing.ellipse(node.pos.x, node.pos.y, node.rad * 2, node.rad * 2);
		    });
	    });
    };
}
