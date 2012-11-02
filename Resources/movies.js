// global (ESTO NO SE HACE!!! pero bueh una solita)
Ti.App.llUpdated = false;

// creo el objeto movies (la aplicacion en si)
var movies = {
	android: {
		menu: {}	
	},
    ui: {},
    __isLargeScreen: undefined,
    __isAndroid: undefined,
    navGroup: undefined
};

(function() {
	
	// propiedades 
	movies.osname = Titanium.Platform.osname;
	movies.longitude = null;
	movies.latitude = null
	movies.altitude = null;
	movies.heading = null;
	movies.accuracy = null;
	movies.speed = null;
	movies.timestamp = null;
	movies.altitudeAccuracy = null;
	movies.ancho = Ti.Platform.displayCaps.platformWidth;	
	movies.alto = Ti.Platform.displayCaps.platformHeight;
	movies.rh = 140; // rowHeight
	movies.ERROR_CONNECTION = 'Hay problemas en la conexión';
	movies.WSHOST = 'http://h1movies.herokuapp.com';
	
		
	/*	
		Branching logic based on OS
	*/
	movies.os = function(/*Object*/ map) {
		var def = map.def||null; //default function or value
		if (typeof map[osname] != 'undefined') {
			if (typeof map[osname] == 'function') { return map[osname](); }
			else { return map[osname]; }
		}
		else {
			if (typeof def == 'function') { return def(); }
			else { return def; }
		}
	};
			
	movies.isAndroid = function() {
		if (movies.__isAndroid === undefined) {
			movies.__isAndroid = (movies.osname == 'android');
		}
		return movies.__isAndroid;
	};
	
	
})();



Ti.include(
	'ui/ui.js'
);

// Note: if we have configuration, it will have to go in 
/*
	'/movies/config/config.js'
*/
