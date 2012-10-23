/**
 * 
 *  H1movies
 *  @author H1Lab, Nicolás Peralta
 *  @version 1.0  
 * 
 */


// main logic, main properties
Ti.include('movies.js');

// create the main application window
movies.ui.createApplicationWindow();



/*
var estrenosActivity = null;
// create tab group
var tabGroup = Titanium.UI.createTabGroup();

Ti.include(
	'h1/conf.js',
	'h1/movies.js',
	'h1/activityIndicator.js'
	);


//
// estrenos
//

Ti.include('estrenos.js');

//
// cartelera
//

Ti.include("cartelera.js");

//
// cines
//

Ti.include("cines.js");

var loaded = [false, false, false];

tabGroup.addEventListener('focus', function(e) {
	if (!loaded[e.index]) {

		switch (e.index ) {
			case 0:
				estrenos();
				loaded[e.index] = true;								
				break;
			case 1:
				cartelera();
				loaded[e.index] = true;								
				break;
			case 2:
				cines = new H1movies.cines({win: winCines, tab: tabCines});
				cines.open();				
				loaded[e.index] = true;								
				break;
			default:
				estrenos();
				loaded[0] = true;
				break;
		}
	}	
	
});


// open tab group
tabGroup.open();

// en android hay que forzar el focus
if (osname == 'android')
	tabGroup.fireEvent('focus');
	
// listeners globales
function paramValues(event) {
  var movieId = event.movieId;
  var titulo = event.titulo;
}
Ti.App.addEventListener('passValues', paramValues);

// geolocation	
Ti.include('h1/geo.js');

tabGroup.addEventListener("close", function() {
	Ti.App.removeEventListener("passValue", passValues);
	H1movies.cines = null;	
});
*/