// 
// CineListadoView class
//
exports.buildView = function (_args) {
	// detail view
	var winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff'});
	var cineDetailView = require('/ui/CineDetailView');	

	var movies = _args.movies;
	var latitude = _args.latitude;
	var longitude = _args.longitude;
	var pelicula_id = _args.pelicula_id;
	// create a var to track the active row
	var currentRow = null;
	var currentRowIndex = null;
	
	// create table view  
	tableView = Titanium.UI.createTableView();;
	if (movies.osname == 'android') {
		tableView.backgroundColor = '#58595B';
	}
	else {
		tableView.backgroundColor = '#ffffff';
		tableView.borderColor = '#fff';
		tableView.separatorColor = '#fff';		
	}
		
	movies.ui.indicator.openIndicator();
		
	var Cine = require('model/Cine').Cine;	
	// instance
	var cine = new Cine(movies);

	// get cines		
	var row = null;		


	if (!pelicula_id)
		var cines = cine.getCines({
			host: movies.WSHOST, 
			success: buildRows,
			latitude: latitude,
			longitude: longitude,
			movies: movies 	
		});	
	else
		var cines = cine.getCines({
			host: movies.WSHOST, 
			success: buildRows,
			pelicula_id: pelicula_id,
			movies: movies 	
		});	

	

	// listener
	tableView.addEventListener('click', function(e) {
		if (e.rowData.movieId) {
			
			winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff'});

			// creo la windows de la descripcion	
			winDescripcion.title = e.rowData.titulo;
						
			// Pelicula view
			winDescripcion.add(cineDetailView.build({titulo: e.rowData.titulo, movieId: e.rowData.movieId, win: winDescripcion, movies: movies, pelicula_id: pelicula_id}));

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
	});	 // end listener
	
	

	function buildRows(mvs) {
		
		var movies = _args.movies;	 		
		var data = [];
		for (var c=0; c<mvs.length; c++) {
		
			var movie = mvs[c];
			var cine_id = movie.cine_id;
			var brief = '';
			var imagen = 'images/' + movie.imagen;
			var titulo = movie.nombre;

			// create row				
			row = createRow(imagen, cine_id, titulo);
			
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
				color:'grey',
				font:{fontSize:fsName, fontFamily:'Arial'},
				left:5,
				top: 25,
				height:30,
				width: w,
				clickName:'movieName',
				text: titulo
			});
		
			row.filter = movieName.text;
			row.add(movieName);
			
		
			data.push(row);	
		
		} // end for		
		tableView.data = data;
		movies.ui.indicator.closeIndicator();	
	} // end function

	function createRow(imagen, pelicula_id, titulo) {
		var movies = _args.movies;		
		// creo la row
		var path = Titanium.Filesystem.resourcesDirectory;
		var row = Ti.UI.createTableViewRow({hasChild:true,movieId: pelicula_id, titulo: titulo });
		row.backgroundSelectedColor = '#fff';
		row.height = 77;
		row.className = 'datarow';
		row.clickName = 'row';
		if (movies.osname == 'android')
			row.rightImage = '../images/right_arrow.png';
		else 
			row.rightImage = 'images/right_arrow.png';
		var maskView = Titanium.UI.createView({				
			top:0,
			width: movies.ancho,
			height: 75,
			backgroundColor: '#000000',
			opacity: 0.45
		});
		
		// row.add(maskView);
						

		return row;
		
	}

	return tableView;
	
}; // end function
