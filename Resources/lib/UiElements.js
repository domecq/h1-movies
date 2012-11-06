/**
 * Indicator window with a spinner and a label
 *
 * @param {Object} args
 */
function createIndicatorWindow(args) {
    var width = 180,
        height = 50;

    var args = args || {};
    var top = args.top || 145;
    var text = args.text || 'Cargando ...';
    var osname = Titanium.Platform.osname;

    var win = Titanium.UI.createWindow({
        height:           height,
        width:            width,
        top:              top,
        borderRadius:     10,
        touchEnabled:     false,
        backgroundColor:  '#000',
        opacity:          0.6
    });

	if (osname != 'android') {    
	
	    var view = Ti.UI.createView({
	        width:   Ti.UI.SIZE,
	        height:  Ti.UI.FILL,
	        center:  { x: (width/2), y: (height/2) },
	        layout:  'horizontal'
	    });
	    
	    var label = Titanium.UI.createLabel({
	        left:    10,
	        width:   Ti.UI.FILL,
	        height:  Ti.UI.FILL,
	        text:    text,
	        color:   '#fff',
	        font:    { fontFamily: 'Helvetica Neue', fontSize: 16, fontWeight: 'bold' }
	    });
	}    

    var activityIndicator = Ti.UI.createActivityIndicator({
        left:    0,
        height:  Ti.UI.FILL,
        width:   30
    });
    
	if (osname != 'android')    
		activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.PLAIN;
	else
		activityIndicator.message = text;
			
	if (osname != 'android') {
	    view.add(activityIndicator);
	    view.add(label);
	    win.add(view);
	}

    function openIndicator() {
        if (osname != 'android') win.open();
        activityIndicator.show();
    }

    win.openIndicator = openIndicator;

    function closeIndicator() {
        activityIndicator.hide();
        win.close();
    }

    win.closeIndicator = closeIndicator;

    return win;
}

// Public interface
exports.createIndicatorWindow = createIndicatorWindow