// 
// CineView class
//

// constructor

exports.init = function (_args) {
	// get the _args		
	var movies = _args.movies;
	var Geo = require('lib/Geo');
	var geo = new Geo();
	// Cine model			
	var Cine = require('model/Cine').Cine;	
	var cine = new Cine();
	// detail view
	var cineDetailView = require('/ui/cineDetailView');	
	var latitude = null;
	var longitude = null;



	
	// public methods
		
	var buildView = function (pelicula_id) { 

		var movies = _args.movies;
		pelicula_id = (typeof pelicula_id!=='undefined') ? pelicula_id : null;


		// create a var to track the active row
		var currentRow = null;
		var currentRowIndex = null;
		
		win = _args.win;
		tab = movies.ui.tabs.currentTab;
		
		// creo el mapa
		mapview = Titanium.Map.createView({
					mapType: Titanium.Map.STANDARD_TYPE,
					animate:true,
					regionFit:true,
					userLocation:true,
					top: 1
				});

		mapIsAdded = false;
		


		////////////// private methods ////////////////

		var reload = function() {
			var movies = _args.movies;
			var params = {
				host: movies.WSHOST, 
				success: drawPins,
				latitude: latitude,
				longitude: longitude 	
			};
			if (pelicula_id !== null) params.pelicula_id = pelicula_id; 
			var cines = cine.getCines(params);	
		};


		var drawArea = function() {
			
			var movies = _args.movies;
			
			// defino la region del mapa
			latitude = geo.getLatitude();
			longitude = geo.getLongitude();
			Ti.API.info('location ' + latitude + ' ' + longitude );
			// if (latitude == null || longitude == null ) {
				latitude = -34.569281;
				longitude = -58.468939;
			// }	
			mapview.region = {latitude: latitude, longitude: longitude, latitudeDelta:0.04, longitudeDelta:0.04};	
			
			// creo el menú para android y el tab nav para ios	
			createCineMenuUI(tab,win);
					
			// get cines		
			var row = null;

			var params = {
				host: movies.WSHOST, 
				success: drawPins,
				latitude: latitude,
				longitude: longitude 	
			};

			if (pelicula_id !== null) params.pelicula_id = pelicula_id; 
			var cines = cine.getCines(params);	

		}

		var drawPins = function(cns) {
			// globals
			var movies = _args.movies;	 	
			var data = [];

			for (var c=0; c<cns.length; c++) {
			
				var cine = cns[c];
				var cine_id = cine.cine_id;
				var nombre = cine.nombre;
				var imagen = cine.imagen;
				var distancia = cine.distancia;
				var lat = cine.lat;
				var lon = cine.lon;
				var cineAnnotations = [];
				
				if (cine_id != 0 ) { 
					
					var mapParams = {
							latitude: lat,
							longitude: lon,
							title: nombre,
							subtitle: nombre,
							animate:true,
							cineId: cine_id 
						};
						
					if (movies.osname != 'android') {
						mapParams.pincolor = Titanium.Map.ANNOTATION_PURPLE;
						mapParams.rightButton = Titanium.UI.iPhone.SystemButton.DISCLOSURE;
					} else {				
						mapParams.image = "/images/pin.png";
					}
					
					var annotation = Titanium.Map.createAnnotation(mapParams);						
					mapview.addAnnotation(annotation);			
				}
						
			} // end for
			
			// el mapa tiene que ser global si no no funciona (??) y solo puede haber 1 por view (al menos en android)
			if (!mapIsAdded) {
				win.add(mapview);
				mapIsAdded = true;
			}
				
				
			//movies.ui.activityIndicator.hide();				
			mapview.addEventListener('click', clickAnnotation);			
			movies.ui.indicator.closeIndicator();
		} // end function


		var clickAnnotation = function(e) {
			var movies = _args.movies;
			// abro la descripcion del cine
			if (!e) return;
			if (e.annotation && (e.clicksource === 'title' || e.clicksource == 'rightButton' || e.clicksource == 'subtitle') ) {
				
				Ti.API.log('Memoria disponible ' + Ti.Platform.availableMemory);    

				var winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff'});
				winDescripcion.title = e.title;

				// Pelicula view
				winDescripcion.add(cineDetailView.build({titulo: e.annotation.title, movieId: e.annotation.cineId, win: winDescripcion, movies: movies}));

				if (movies.osname=="android" ) {
					movies.ui.tabs.currentTab.add(winDescripcion);
					winDescripcion.open({animated: true});
					_args.win.addEventListener('android:back',function(e){
						winDescripcion.close();
						return false;
					});					
					
				}	
							
				if (movies.osname=="iphone" || movies.osname == "ipad" ) {
					movies.ui.tabs.currentTab.setWindow(winDescripcion);
					movies.ui.tabs.currentTab.open(winDescripcion,{animated:true});
				}				
							
			}         
		}

		var onCreateCineMenu = function(e) {
			var menu = e.menu;			
			lstCines = menu.add({title : 'Listado'});
			var path = Titanium.Filesystem.resourcesDirectory;
			//lstCines.setIcon('list.png');
			refreshCines = menu.add({title : 'Actualizar', mapview: mapview});
			//refreshCines.setIcon('refresh.png');	
			
			lstCines.addEventListener('click', createCineListadoUI );

			refreshCines.addEventListener('click', function(e) {
				mapview.removeAllAnnotations();
				mapview.removeEventListener('click', clickAnnotation);	
				reload();
			});
					
		};

		var createCineListadoUI = function () {
			var movies = _args.movies;
			// Cine list view
			var CineListadoView = require('/ui/CineListadoView');
			var winDescripcion = Ti.UI.createWindow();
			var listadoView = new CineListadoView({titulo: 'Cines', win: winDescripcion, movies: movies});
			winDescripcion.add(listadoView.buildView());

			if (movies.osname=="android" ) {
				tab.add(winDescripcion);
				winDescripcion.open({animated: true});
				_args.win.addEventListener('android:back',function(e){
					winDescripcion.close();
					return false;
				});					
				
			}	
						
			if (movies.osname=="iphone" || movies.osname == "ipad" ) {
				tab.open(winDescripcion,{animated:true});
			}				
		}

		function createCineMenuUI(tab, win) {
			if (movies.osname == 'iphone' || movies.osname=='ipad') {
				// ios nav button
				var listadoButton = Titanium.UI.createButtonBar({
					labels:['Listado'],
					backgroundColor:'#336699'
				});
				var refreshButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.REFRESH });

				win.setRightNavButton(listadoButton);
				win.setLeftNavButton(refreshButton);
				
				
				listadoButton.addEventListener('click', createCineListadoUI );
			
				refreshButton.addEventListener('click', function(e) {
					movies.ui.indicator.openIndicator();
					mapview.removeAllAnnotations();
					mapview.removeEventListener('click', clickAnnotation);	
					reload();
				});

							
			} 	
			if (movies.osname=='android') {		
				// creo menu contextual		
				var activity = win.activity;
				activity.onCreateOptionsMenu = onCreateCineMenu;
			}		
		}

		// geo
		movies.ui.indicator.openIndicator();
		geo.getPosition(drawArea);	

		return mapview;
		
	}; // end function builview
	this.buildView = buildView;


}	// end init
