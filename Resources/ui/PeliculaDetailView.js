//
// PeliculaDetailView class
//

function PeliculaDetailView(_args) {
	//var win = Titanium.UI.currentWindow;
	// creo la vista para el detalle
	var titulo = _args.titulo,
		movieId = _args.movieId,
		movies = _args.movies,
		tab = _args.movies.ui.tabs.currentTab;
		
	
	
	var Pelicula = require('model/Pelicula').Pelicula;
	var peli = new Pelicula();
	
	var tableView = Titanium.UI.createTableView({
		filterAttribute:'filter',
		backgroundColor:'white',
		separatorColor:'#fff',
	});
	
	var _win = _args.win;
	

	movies.ui.indicator.openIndicator();
	
	peli.getPelicula({
		movie_id: movieId,
		host: movies.WSHOST,		 
		success: function (mvs) {	 			
			var movie = mvs[0];
			var pelicula_id = movie.pelicula_id;
			var descripcion = movie.descripcion;			
			var imagen = movie.imagen;
			var titulo = movie.titulo;
			
			// creo el titulo de la pelicula
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
			
			
			// titulo de la pelicula		
			var movieName = Ti.UI.createLabel({
				color:'#576996',
				font:{fontSize:fs,fontWeight:'bold', fontFamily:'Arial'},
				left: (movies.ancho / 2) - (titulo.length*fsw/2),
				top: 2,
				height:30,
				width: titulo.length * fs,
				text: titulo
			});

			// creo la row para el titulo
			var row = Ti.UI.createTableViewRow({hasChild:false});
			row.backgroundSelectedColor = '#fff';
			row.borderColor = '#fff';		
			row.height = 30;
			row.className = 'datarow';
			row.clickName = 'row';		
			row.add(movieName);
			data.push(row);	

			// creo la foto	
			var photo = Titanium.UI.createImageView({ 
				image: imagen,
				left: (movies.ancho / 2) - 150,
				top: 5,
				height:300,
				width:300
			});
	
			var row = Ti.UI.createTableViewRow({hasChild:false});
			row.backgroundSelectedColor = '#fff';
			row.borderColor = '#fff';		
			row.height = 310;
			row.className = 'datarow';
			row.clickName = 'row';		
			row.add(photo);
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
			
		 	var alto  = Math.floor(descripcion.length * fsw / (movies.ancho - 30)) ;		
			var delta = 7; // compensación por que ios no separa las palabras		
			var altoDescripcion = (alto + delta)  * fs;
							
			
			// creo la descripcion
			var description = Ti.UI.createLabel({
				color:'#222',
				font:{fontSize:fs,fontWeight:'normal', fontFamily:'Arial'},
				left:20,
				top: 5,
				height: altoDescripcion,
				width: movies.ancho - 30,
				clickName:'description',
				text: descripcion 
			});

			var row = Ti.UI.createTableViewRow({hasChild:false});
			row.backgroundSelectedColor = '#fff';
			row.borderColor = '#fff';
			row.height = altoDescripcion + 5;
			row.className = 'datarow';
			row.clickName = 'row';		
			row.add(description);
			data.push(row);	
	
			// creo el label horarios
			var horario = Ti.UI.createLabel({
				color:'#222',
				font:{fontSize:fs + 3,fontWeight:'normal', fontFamily:'Arial'},
				left:10,
				top: 1,
				height: 50,
				width: 'auto',
				clickName:'horario',
				text: 'Cines y horarios' 
			});
			
			// creo el icono	
			/*
			var icono = Titanium.UI.createImageView({ 
				image: 'images/horarios.png',
				left: 12.5,
				top: 12,
				height:25,
				width:26
			})
			*/
			
			var row = Ti.UI.createTableViewRow({hasChild:true, movieId: pelicula_id });
			row.backgroundSelectedColor = '#fff';
			row.borderColor = '#ccc';
			row.height = 50;
			row.className = 'datarow';
			row.clickName = 'row';		
			row.add(horario);
			//row.add(icono);
			data.push(row);				
				
			tableView.data = data;
			_win.add(tableView);				
			// oculto el indicador de estado		
			movies.ui.indicator.closeIndicator();

				
		}
			
	});
	
	tableView.addEventListener('click', function(e) {
 		// 'cines/findwhere/:latitud/:longitud/:movie_id
		if (e.rowData.movieId) {
			
			// Cine list view
			var CineView = require('/ui/CineView');
			var winDescripcion = Ti.UI.createWindow();
			var listadoView = new CineView({titulo: 'Cines', win: winDescripcion, movies: movies});
			winDescripcion.add(listadoView.buildView(e.rowData.movieId));
		
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
		
		
	});
			
	return _win;
}

module.exports = PeliculaDetailView;