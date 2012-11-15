
// creo el objeto movies, estes es el único objeto que tiene contexto global
// TODO: esto debe ser reemplazado en un futuro por un modulo que contenga
// las constantes que son necesarias a lo largo del proyecto.

var movies = {
	android: {
		menu: {}	
	},
    ui: {},
    __isLargeScreen: undefined,
    __isAndroid: undefined
};
 
var memoryCleaner = require('lib/MemoryCleaner');

// propiedades 
movies.osname = Titanium.Platform.osname;
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
	if (typeof map[movies.osname] != 'undefined') {
		if (typeof map[movies.osname] == 'function') { return map[movies.osname](); }
		else { return map[movies.osname]; }
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

movies.memoryCleaner = new memoryCleaner();
