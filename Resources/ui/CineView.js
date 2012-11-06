// 
// CineView class
//

var self = this;

// constructor

function CineView(_args) {
	// get the _args		
	self._args = _args;	
	self.movies = _args.movies;
}	


	
// public methods
	
CineView.prototype.buildView = function () { 

	var movies = self._args.movies;
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
	
	// defino la region del mapa
	latitude = movies.latitude;
	longitude = movies.longitude;
	if (latitude == null || longitude == null ) {
		latitude = -34.569281;
		longitude = -58.468939;
	}	
	self.mapview.region = {latitude: latitude, longitude: longitude, latitudeDelta:0.04, longitudeDelta:0.04};	
	
	// creo el menú para android y el tab nav para ios	
	createCineMenuUI(self.tab,self.win);
			
	// Cine model			
	var Cine = require('model/Cine').Cine;	
	// instance
	var cine = new Cine();
	// get cines		
	var row = null;

	//movies.ui.activityIndicator.message = 'Cargando Cines ...';
	// en ios necesita estar attachado a una ventana
	//if (movies.osname != 'android')
	//	self.win.add(movies.ui.activityIndicator);
	
	var cines = cine.getCines({
		host: movies.WSHOST, 
		success: buildRows,
		latitude: latitude,
		longitude: longitude 	
	});	
	
	return self.mapview;
	
}; // end function

CineView.prototype.reload = function() {
		var cines = cine.getCines({
			host: self._args.movies.WSHOST, 
			success: buildRows 
		});		
};


////////////// private methods ////////////////

var buildRows = function(cns) {
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
				mapParams.image = "../images/pin.png";
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
			

} // end function


var clickAnnotation = function(e) {
	var movies = self.movies;
	// abro la descripcion del cine
	if (!e) return;
	if (e.annotation && (e.clicksource === 'title' || e.clicksource == 'rightButton' || e.clicksource == 'subtitle') ) {
		
		// creo la windows de la descripcion	
		var winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff', title:e.rowData.titulo})
	
		// Pelicula view
		var CineDetailView = require('/ui/CineDetailView');
		winDescripcion = new PeliculaDetailView({titulo: e.rowData.titulo, movieId: e.rowData.cineId, win: winDescripcion, movies: movies});
	
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
}

var onCreateCineMenu = function(e) {
	var menu = e.menu;			
	lstCines = menu.add({title : 'Listado'});
	var path = Titanium.Filesystem.resourcesDirectory;
	//lstCines.setIcon('list.png');
	refreshCines = menu.add({title : 'Actualizar', mapview: mapview});
	//refreshCines.setIcon('refresh.png');	
	refreshCines['loadData'] = self.loadData
	
	lstCines.addEventListener('click', createCineListadoUI );

	refreshCines.addEventListener('click', function(e) {
		self.mapview.removeAllAnnotations();
		self.mapview.removeEventListener('click', clickAnnotation);	
		e.source.loadData();
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
		
		self.win.setRightNavButton(listadoButton);
		
		listadoButton.addEventListener('click', createCineListadoUI );
					
	} 	
	if (self.movies.osname=='android') {		
		// creo menu contextual		
		var activity = self.win.activity;
		activity.onCreateOptionsMenu = onCreateCineMenu;
	}		
}

// public interface

module.exports = CineView;
