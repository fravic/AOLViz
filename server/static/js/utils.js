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