//
// CineDetailView class
//


exports.build = function(_args) {
	//var win = Titanium.UI.currentWindow;
	// creo la vista para el detalle
	var args = _args;
	var titulo = _args.titulo,
		movieId = _args.movieId,
		movies = _args.movies;
	
	
	var Cine = require('model/Cine').Cine;
	var peli = new Cine();
	
	tableView = Titanium.UI.createTableView({
		filterAttribute:'filter',
		backgroundColor:'white',
		separatorColor:'#fff',
	});		

	movies.ui.indicator.openIndicator();
	
	peli.getCine({
		cine_id: movieId,
		host: movies.WSHOST,		 
		movies: movies,
		success: function (cns) {	 			
			var cine = cns[0];
			var nombre = cine.nombre;			
			var direccion = cine.direccion;
			var localidad = cine.localidad;
			var peliculas = cine.peliculas;
			
			// creo el titulo de la cine
			var fs = 16;
			var fsw = 8.6; // el ancho en pixeles para ios
			var top = 12;
			
			if (movies.osname == 'android') {
				// HVGA
				if ( movies.ancho == 320 ) {
					fs = 15;
					fsw = 7.4;					
				} else {					
					fs = 20;
					fsw = 10.5;
				}			
			}
			
			var data = [];
			
			var currentRow = null;
			var currentRowIndex = null;
			
			
			// nombre del cine		
			var cineName = Ti.UI.createLabel({
				color:'#576996',
				font:{fontSize:fs,fontWeight:'bold', fontFamily:'Arial'},
				left: (movies.ancho / 2) - (nombre.length*fsw/2),
				top: 2,
				height:30,
				width: nombre.length * fs,
				text: nombre
			});


			// creo la row para el nombre
			var row = Ti.UI.createTableViewRow({hasChild:false});
			row.backgroundSelectedColor = '#fff';
			row.borderColor = '#fff';		
			row.height = 30;
			row.className = 'datarow';		
			row.add(cineName);
			data.push(row);	


			var fs = 14;
			fsw = 6.4;
					
			if (movies.osname == 'android') {
				// HVGA
				if ( movies.ancho == 320 ) {
					fs = 13;
					fsw = 6.4;					
				} else {					
					fs = 20;
					fsw = 10;
				}		
			}
			
			var descripcion = direccion + ' ' + localidad ;			
		 	var alto  = Math.floor(descripcion.length * fsw / (movies.ancho - 30)) ;		
			var delta = 5; // compensación por que ios no separa las palabras		
			var altoDescripcion = (alto + delta)  * fs;
			
			// creo la descripcion
			var description = Ti.UI.createLabel({
				color:'#222',
				font:{fontSize:fs,fontWeight:'normal', fontFamily:'Arial'},
				left:20,
				height: altoDescripcion,
				width: movies.ancho - 30,
				text: descripcion 
			});

			var row = Ti.UI.createTableViewRow({hasChild:false});
			row.backgroundSelectedColor = '#fff';
			row.borderColor = '#fff';
			row.height = altoDescripcion;
			row.className = 'datarow';
			row.add(description);
			data.push(row);	
	
	
			for (var i=0;i<peliculas.length;i++ ) {	
				
				var titulo = peliculas[i].titulo;
				var horarios = peliculas[i].horas;
				var pelicula_id = peliculas[i].pelicula_id;
				var ancho = movies.ancho - 35;
			 	var alto  = Math.floor(horarios.length  / (movies.ancho - 30)) ;		
				
				// titulo
				var movieTitulo = Ti.UI.createLabel({
					color:'#576996',
					font:{fontSize: fs,fontWeight:'bold', fontFamily:'Arial'},
					left:20,
					height: 20,
					width: ancho,
					text: titulo,
					top: 0
				});
				
				// creo los horarios
				var movieHorarios = Ti.UI.createLabel({
					color:'#222',
					font:{fontSize:fs,fontWeight:'normal', fontFamily:'Arial'},
					left:20,
					width: ancho,
					height: 40,					
					text: horarios,
					top: 22
				});
				
				var row = Ti.UI.createTableViewRow({hasChild:true, movieId: pelicula_id, titulo: titulo});
				row.backgroundSelectedColor = '#fff';
				row.borderColor = '#ccc';
				row.height = 70;
				row.add(movieTitulo);
				row.add(movieHorarios);
				if (movies.osname == 'android')
					row.rightImage = '../images/right_arrow_black.png';
				else 
					row.rightImage = 'images/right_arrow_black.png';

				data.push(row);				
			}
				
			tableView.data = data;
			// oculto el indicador de estado
			movies.ui.indicator.closeIndicator();
				
		}
			
	});
	
	tableView.addEventListener('click', function(e) {
		// Ti.API.info('table view row clicked - source ' + e.source);
		// Aca tendria que mostrar el detalle de las peliculas

		if (e.rowData.movieId) {
			// creo la ventana
			var winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff', title:e.rowData.titulo})
			// Pelicula view
			var peliculaDetailView = require('/ui/PeliculaDetailView');
			winDescripcion.add(peliculaDetailView.build({titulo: e.rowData.titulo, movieId: e.rowData.movieId, win: winDescripcion, movies: movies})); 

			if (movies.osname=="android" ) {
				movies.ui.tabs.currentTab.add(winDescripcion);
				winDescripcion.open({animated: true});
				args.win.addEventListener('android:back',function(e){
					winDescripcion.close();
					return false;
				});					
				
			}	
						
			if (movies.osname=="iphone" || movies.osname == "ipad" ) {
				movies.ui.tabs.currentTab.open(winDescripcion,{animated:true});
			}				

		}	
	});
			
	return tableView;
}
