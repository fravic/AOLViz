$.fn.preload = function() {
    this.each(function(){
            var img = new Image();
            img.src = this;
            $(img).hide();
            $("body").append($(img));
        });
};

function shuffle(arr) {
    var i = arr.length;
    if ( i == 0 ) return false;
    while ( --i ) {
	var j = Math.floor( Math.random() * ( i + 1 ) );
	var tempi = arr[i];
	var tempj = arr[j];
	arr[i] = tempj;
	arr[j] = tempi;
    }
}

function addPoints(a, b) {
    return {x:(a.x + b.x), y:(a.y + b.y)};
}

function slog(str) {
    console.log(str);
}

function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function questionify(string) {
    if (string.charAt(string.length-1) != '?') {
        return string + '?';
    }
}

String.prototype.startsWith = function(str) {
    return (this.indexOf(str) === 0);
}