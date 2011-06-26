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
    
    this.getMaxRad = function() { return _maxRad; }

    this.getGlobalPos = function() {
        if (!_parent) {
            console.error("Parent not set on snake node!");
        }
        return addPoints(_pos, _parent.getGlobalPos());
    }

    this.setXPos = function(xpos) {
        _pos.x = xpos;
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
        _pos.y = 25 * _parent.getAmpl() * Math.sin(1/(_parent.getWave() * 50) *
                                               (_pos.x + _parent.getInitPos().x));
    }
}

function _Snake(speed, ampl, wave) {

    console.log("new snake")

    var _initpos = {x:Math.random()*Application.getWidth(),
                    y:Math.random()*Application.getHeight()}
    var _speed = speed ? speed : 1;
    var _ampl = ampl ? ampl : 1;
    var _wave = wave ? wave : 1;
    var _pos = _initpos;

    var _nodes = [];
    var _nodeQueue = [];
    var _nextNodeXPos = 0;

    this.addNode = function(snakeNode) {
        console.log("new node")
        console.log(_nextNodeXPos)
        snakeNode.setXPos( _nextNodeXPos - snakeNode.getMaxRad());
        _nextNodeXPos -= (snakeNode.getMaxRad() * 2)
        _nodeQueue.push(snakeNode);
    }

    this.getNodes = function() { return _nodes; }

    this.getSpeed = function() { return _speed; }
    this.getAmpl = function() { return _ampl; }
    this.getWave = function() { return _wave; }
    this.getGlobalPos = function() { return _pos; }
    this.getInitPos = function() { return _initpos; }

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
        _pos.x += speed;
    }
}
