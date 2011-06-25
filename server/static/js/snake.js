function _SnakeNode(time, pos, rad, color, stroke) {

    var RAD_RATE = 0.2;

    var _time = time ? time : 0;
    var _pos = pos ? pos : {x:0, y:0};
    var _maxRad = rad ? rad : 3;
    var _color = color ? color : {r:0, g:0, b:0};
    var _stroke = stroke ? stroke : _color;

    var _parent = null;
    var _curRad = 0;

    this.getTime = function() { return _time; }
    this.getColor = function() { return _color; }
    this.getStroke = function() { return _stroke; }

    this.getRadius = function() {
        return _curRad;
    }

    this.getGlobalPos = function() {
        if (!_parent) {
            console.error("Parent not set on snake node!");
        }
        return addPoints(_pos, _parent.getGlobalPos());
    }

    this.setParent = function(parent) {
        _parent = parent;
    }

    this.update = function() {
        if (_curRad < _maxRad) {
            _curRad += RAD_RATE;
            _curRad = _curRad > _maxRad ? _maxRad : _curRad;
        }

        move();
    }

    function move() {
        _pos.x += 1;
        _pos.y += 1;
    }
}

function _Snake(speed, ampl, wave) {

    var _speed = speed ? speed : 1;
    var _ampl = ampl ? ampl : 1;
    var _wave = wave ? wave : 1;
    var _pos = {x:0, y:0};

    var _nodes = [];
    var _nodeQueue = [];

    this.addNode = function(snakeNode) {
        _nodeQueue.push(snakeNode);
    }

    this.getNodes = function() { return _nodes; }

    this.getGlobalPos = function() {
        return _pos;
    }

    this.update = function() {
        var len = _nodeQueue.length;
        $.each(_nodeQueue, function(idx, node) {
                if (idx >= len) return false;
                if (node.getTime() < Application.getDisplayTime()) {
                    _nodes.push(node);
                    _nodeQueue.splice(idx, 1);
                    len--;
                }
            });

        $.each(_nodes, function(idx, node) {
                node.update();
            });

        move();
    }

    function move() {
    }
}
