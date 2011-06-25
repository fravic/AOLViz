// Renderers are essentially static, due to Processing.js
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
                        var pos = node.getGlobalPos();
                        var rad = node.getRadius();
                        var color = node.getColor();
                        var stroke = node.getStroke();

                        processing.fill(color.r, color.g, color.b);
                        processing.stroke(stroke.r, stroke.g, stroke.b);
                        processing.ellipse(pos.x, pos.y, rad * 2, rad * 2);
                    });
            });
    };
}
<