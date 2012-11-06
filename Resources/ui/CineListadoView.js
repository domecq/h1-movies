// 
// CineListadoView class
//

var self = this;

function CineListadoView(_args) {
	// get the _args		
	self._args = _args;
}	


	
// public interface
	
CineListadoView.prototype.buildView = function () { 

	var movies = self._args.movies;
	// create a var to track the active row
	var currentRow = null;
	var currentRowIndex = null;
	
	// create table view  
	self.tableView = Titanium.UI.createTableView({
				filterAttribute:'filter',
				backgroundColor:'#58595B'
	});;
		
	
	//movies.ui.activityIndicator.message = 'Cargando cines ...';
	
	//if (movies.osname != 'android')
	//	_win.add(movies.ui.activityIndicator);
		
	var Cine = require('model/Cine').Cine;	
	// instance
	var cine = new Cine();

	// get cines		
	var row = null;		

	var cines = cine.getCines({
		host: movies.WSHOST, 
		success: buildRows,
		latitude: movies.latitude,
		longitude: movies.longitude 	
	});	
	

	// listener
	self.tableView.addEventListener('click', function(e) {
		if (e.rowData.movieId) {
			// Pelicula view
			var PeliculaDetailView = require('/ui/PeliculaDetailView');
			var winDescripcion = new PeliculaDetailView({titulo: e.rowData.titulo, movieId: e.rowData.movieId, win: winDescripcion, movies: movies});

			if (movies.osname=="android" ) {
				movies.ui.tabs.currentTab.add(winDescripcion);
				winDescripcion.open({animated: true});
				self._args.win.addEventListener('android:back',function(e){
					winDescripcion.close();
					return false;
				});					
				
			}	
						
			if (movies.osname=="iphone" || movies.osname == "ipad" ) {
				movies.ui.tabs.currentTab.open(winDescripcion,{animated:true});
			}				

		}	
	});	 // end listener
	
	
	return self.tableView;
	
}; // end function


// private

function buildRows(mvs) {
	
	var movies = self._args.movies;	 		
	var data = [];
	movies.rh = 80;
	for (var c=0; c<mvs.length; c++) {
	
		var movie = mvs[c];
		var cine_id = movie.cine_id;
		var brief = '';
		var imagen = 'images/' + movie.imagen;
		var titulo = movie.nombre;

		// create row				
		row = movies.ui.createRow(imagen, cine_id, titulo);
	
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
											
		// creo el titulo del cine
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
	movies.rh = 140;
	self.tableView.data = data;
} // end function


module.exports = CineListadoView;
