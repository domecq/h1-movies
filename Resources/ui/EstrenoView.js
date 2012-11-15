// 
// EstrenoView class
//

var self = this;

function EstrenoView(_args) {
	// get the _args		
	self._args = _args;

	// model pelicula
	var Pelicula = require('model/Pelicula').Pelicula;	
	self.pelicula = new Pelicula();
	// detail view
	self.winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff'});
	self.peliculaDetailView = require('/ui/PeliculaDetailView');	

}	


	
// public interface
	
EstrenoView.prototype.buildView = function () { 

	var movies = self._args.movies;
	// create a var to track the active row
	var currentRow = null;
	var currentRowIndex = null;

	if (movies.osname!='android') {
		// refresh button
		var refreshButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.REFRESH });
		self._args.win.setRightNavButton(refreshButton);
	} else {
		self._args.win.activity.onCreateOptionsMenu = onCreateCineMenu;
	}
	
	// create table view  
	self.tableView = Titanium.UI.createTableView();	
	if (movies.osname == 'android') {
		self.tableView.backgroundColor = '#58595B';
	}
	else {
		self.tableView.backgroundColor = '#ffffff';
		self.tableView.borderColor = '#fff';
		self.tableView.separatorColor = '#fff';		
	}
	
	movies.ui.indicator.openIndicator();
		
	// get estrenos		
	var row = null;		

	var estrenos = self.pelicula.getEstrenos({
		host: movies.WSHOST, 
		success: buildRows,
		movies: movies 	
	});
	

	// listener
	self.tableView.addEventListener('click', function(e) {
		if (e.rowData.movieId) {
			Ti.API.log('Memoria disponible ' + Ti.Platform.availableMemory);    

			// destruyo la ventana previa
			self.winDescripcion.close();
			self.winDescripcion = null;
			self.winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff'});

			// creo la ventana
			var winDescripcion = self.winDescripcion;
			winDescripcion.title = e.rowData.titulo;

			// Pelicula view
			winDescripcion.add(self.peliculaDetailView.build({titulo: e.rowData.titulo, movieId: e.rowData.movieId, win: winDescripcion, movies: movies}));

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
	});	 // end listener

	if (movies.osname!='android') {
		refreshButton.addEventListener('click', function(e) {
			reload();
		});
	}
	
	
	return self.tableView;
	
}; // end function

// private

var reload = function() {
	var movies = self._args.movies;	
	self.tableView.setData([]);
	movies.ui.indicator.openIndicator();

	var estrenos = self.pelicula.getEstrenos({
		host: movies.WSHOST, 
		success: buildRows,
		movies: movies 	
	});
};

var onCreateCineMenu = function(e) {
	var movies = self._args.movies;	
	var menu = e.menu;			
	refreshCines = menu.add({title : 'Actualizar', tableView: self.tableView});
	refreshCines.addEventListener('click', function(e) {
		reload();
	});
			
};

function buildRows(mvs) {
	
	var movies = self._args.movies;	 
	
		
	var data = [];

	for (var c=0; c<mvs.length; c++) {
	
		var movie = mvs[c];
		var pelicula_id = movie.pelicula_id;
		var brief = movie.brief;
		var imagen = movie.imagen;
		var titulo = movie.titulo;
			// create row				
		row = movies.ui.createRow(imagen, pelicula_id, titulo);
	
		var viewText = Titanium.UI.createView({
			top:75,
			width: movies.ancho,
			height: 65,
			backgroundColor: '#ffffff'			
		});
		
		row.add(viewText);
	
		var fs = 14;
		var fsw = 7.5;
		
		if (movies.osname == 'android') {
			// HVGA
			if ( movies.ancho == 320 ) {
				fs = 13;
				fsw = 6.5;											
			} else {					
				fs = 14;
				fsw = 7.5;					
			}
			
		}
		var w = movies.ancho - 17;
		var fsName = fs;
											
		// creo el titulo de la pelicula
		var max = (30/(fsName/2))*(w/(fsName/2));
		
		if (movies.osname=='android') {									
			if (titulo.length>=max)
				titulo = titulo.substring(0,max) + '...';
		}			
		var movieName = Ti.UI.createLabel({
			color:'white',
			font:{fontSize:fsName,fontWeight:'bold', fontFamily:'Arial'},
			left:5,
			top: 25,
			height:30,
			width: w,
			clickName:'movieName',
			text: titulo
		});
	
		row.filter = movieName.text;
		row.add(movieName);
		
		// creo la descripcion
		var max = Math.floor((60/(fs-3))*(w/(fs-3)));
		
		if (movies.osname=='android') {
			if (brief!=undefined && brief.length>=max)
				brief = brief.substring(0,max) + '...';
		}
		
		var description = Ti.UI.createLabel({
			color:'black',
			font:{fontSize:fs,fontWeight:'normal', fontFamily:'Arial'},
			left:2,
			top: 77,
			height:60,
			width: w,
			clickName:'description',
			text: brief
		});
		row.add(description);
	
		data.push(row);	
	
	} // end for		

	self.tableView.setData(data);
	movies.ui.indicator.closeIndicator();
} // end function

module.exports = EstrenoView;
