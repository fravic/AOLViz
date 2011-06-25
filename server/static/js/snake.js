function _SnakeNode(pos, rad, color, stroke) {
    this.pos = pos ? pos : {x:0, y:0};
    this.color = color ? color : {r:0, g:0, b:0};
    this.rad = rad ? rad : 3;
    this.stroke = stroke ? stroke : this.color;
}

function _Snake() {
    var _nodes = [];

    this.addNode = function(snakeNode) {
	_nodes.push(snakeNode);
    }

    this.getNodes = function() { return _nodes; }

    this.move = function() {
    }
}
