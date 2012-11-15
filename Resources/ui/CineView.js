// 
// CineView class
//

var self = this;

// constructor

function CineView(_args) {
	// get the _args		
	self._args = _args;	
	self.movies = _args.movies;
	var Geo = require('lib/Geo');
	self.geo = new Geo();
	// Cine model			
	var Cine = require('model/Cine').Cine;	
	self.cine = new Cine();
	// detail view
	self.winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff'});
	self.cineDetailView = require('/ui/cineDetailView');	

}	


	
// public methods
	
CineView.prototype.buildView = function (pelicula_id) { 

	var movies = self._args.movies;
	self.pelicula_id = (typeof pelicula_id!=='undefined') ? pelicula_id : null;


	// create a var to track the active row
	var currentRow = null;
	var currentRowIndex = null;
	
	self.win = self._args.win;
	self.tab = movies.ui.tabs.currentTab;
	
	// creo el mapa
	self.mapview = Titanium.Map.createView({
				mapType: Titanium.Map.STANDARD_TYPE,
				animate:true,
				regionFit:true,
				userLocation:true,
				top: 1
			});

	self.mapIsAdded = false;

	// geo
	movies.ui.indicator.openIndicator();
	self.geo.getPosition(drawArea);	
	
	return self.mapview;
	
}; // end function


////////////// private methods ////////////////

var reload = function() {
	var movies = self._args.movies;
	var params = {
		host: movies.WSHOST, 
		success: drawPins,
		latitude: latitude,
		longitude: longitude 	
	};
	if (self.pelicula_id !== null) params.pelicula_id = self.pelicula_id; 
	var cines = self.cine.getCines(params);	
};


var drawArea = function() {
	
	var movies = self._args.movies;
	
	// defino la region del mapa
	latitude = self.geo.getLatitude();
	longitude = self.geo.getLongitude();
	Ti.API.info('location ' + latitude + ' ' + longitude );
	if (latitude == null || longitude == null ) {
		latitude = -34.569281;
		longitude = -58.468939;
	}	
	self.mapview.region = {latitude: latitude, longitude: longitude, latitudeDelta:0.04, longitudeDelta:0.04};	
	
	// creo el menú para android y el tab nav para ios	
	createCineMenuUI(self.tab,self.win);
			
	// instance
	var cine = self.cine;
	// get cines		
	var row = null;

	var params = {
		host: movies.WSHOST, 
		success: drawPins,
		latitude: latitude,
		longitude: longitude 	
	};

	if (self.pelicula_id !== null) params.pelicula_id = self.pelicula_id; 
	var cines = cine.getCines(params);	

}

var drawPins = function(cns) {
	// globals
	var movies = self._args.movies;	 	
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
				
			if (self.movies.osname != 'android') {
				mapParams.pincolor = Titanium.Map.ANNOTATION_PURPLE;
				mapParams.rightButton = Titanium.UI.iPhone.SystemButton.DISCLOSURE;
			} else {				
				mapParams.image = "/images/pin.png";
			}
			
			var annotation = Titanium.Map.createAnnotation(mapParams);						
			self.mapview.addAnnotation(annotation);			
		}
				
	} // end for
	
	// el mapa tiene que ser global si no no funciona (??) y solo puede haber 1 por view (al menos en android)
	if (!self.mapIsAdded) {
		self.win.add(self.mapview);
		self.mapIsAdded = true;
	}
		
		
	//movies.ui.activityIndicator.hide();				
	self.mapview.addEventListener('click', clickAnnotation);			
	movies.ui.indicator.closeIndicator();
} // end function


var clickAnnotation = function(e) {
	var movies = self.movies;
	// abro la descripcion del cine
	if (!e) return;
	if (e.annotation && (e.clicksource === 'title' || e.clicksource == 'rightButton' || e.clicksource == 'subtitle') ) {
		
		Ti.API.log('Memoria disponible ' + Ti.Platform.availableMemory);    

		// destruyo la ventana previa
		self.winDescripcion.close();
		self.winDescripcion = null;
		self.winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff'});

		// creo la windows de la descripcion	
		var winDescripcion = self.winDescripcion;
		winDescripcion.title = e.title;

		// Pelicula view
		winDescripcion.add(self.cineDetailView.build({titulo: e.annotation.title, movieId: e.annotation.cineId, win: winDescripcion, movies: movies}));

		if (movies.osname=="android" ) {
			movies.ui.tabs.currentTab.add(winDescripcion);
			winDescripcion.open({animated: true});
			self._args.win.addEventListener('android:back',function(e){
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
		self.mapview.removeAllAnnotations();
		self.mapview.removeEventListener('click', clickAnnotation);	
		reload();
	});
			
};

var createCineListadoUI = function () {
	var movies = self._args.movies;
	// Cine list view
	var CineListadoView = require('/ui/CineListadoView');
	var winDescripcion = Ti.UI.createWindow();
	var listadoView = new CineListadoView({titulo: 'Cines', win: winDescripcion, movies: movies});
	winDescripcion.add(listadoView.buildView());

	if (movies.osname=="android" ) {
		self.tab.add(winDescripcion);
		winDescripcion.open({animated: true});
		self._args.win.addEventListener('android:back',function(e){
			winDescripcion.close();
			return false;
		});					
		
	}	
				
	if (movies.osname=="iphone" || movies.osname == "ipad" ) {
		self.tab.open(winDescripcion,{animated:true});
	}				
}

function createCineMenuUI(tab, win) {
	if (self.movies.osname == 'iphone' || self.movies.osname=='ipad') {
		// ios nav button
		var listadoButton = Titanium.UI.createButtonBar({
			labels:['Listado'],
			backgroundColor:'#336699'
		});
		var refreshButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.REFRESH });

		self.win.setRightNavButton(listadoButton);
		self.win.setLeftNavButton(refreshButton);
		
		
		listadoButton.addEventListener('click', createCineListadoUI );
	
		refreshButton.addEventListener('click', function(e) {
			movies.ui.indicator.openIndicator();
			self.mapview.removeAllAnnotations();
			self.mapview.removeEventListener('click', clickAnnotation);	
			reload();
		});

					
	} 	
	if (self.movies.osname=='android') {		
		// creo menu contextual		
		var activity = self.win.activity;
		activity.onCreateOptionsMenu = onCreateCineMenu;
	}		
}

// public interface

module.exports = CineView;
