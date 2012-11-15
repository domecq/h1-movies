var self = this;

function MemoryCleaner() {
    var _window;
 
    init = function() {
        self._window = Ti.UI.createWindow();
        self._window.open();
        self._window.hide();
    }
        
    init();
}

// This is where we clear out the memPool by closing it then reopening it again.
MemoryCleaner.prototype.clean = function(obj) {
    Ti.API.log(Ti.Platform.availableMemory);
    if(obj instanceof Array) {
        var arLen=obj.length;
        for ( var i=0, len=arLen; i<len; ++i ) {
            // We then stick the entire view into the pool
            self._window.add(obj[i]);
        }
    } else {
        // We then stick the entire view into the pool
        self._window.add(obj);
    }

    // We empty the pool by closing it.
    self._window.close();
    Ti.API.log('release ... ' + Ti.Platform.availableMemory);    
    // We recreate the window again for the next object
    init();
};

module.exports = MemoryCleaner;