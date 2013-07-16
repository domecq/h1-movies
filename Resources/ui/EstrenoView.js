// 
// EstrenoView class
//

exports.init = function(_args) {
	// get the _args		
	var _args = _args;

	// model pelicula
	var Pelicula = require('model/Pelicula').Pelicula;	
	var pelicula = new Pelicula();
		
	// public interface
		
	var buildView = function () { 

		// detail view
		var peliculaDetailView = require('/ui/PeliculaDetailView');	

		var movies = _args.movies;
		// create a var to track the active row
		var currentRow = null;
		var currentRowIndex = null;

		if (movies.osname!='android') {
			// refresh button
			var refreshButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.REFRESH });
			_args.win.setRightNavButton(refreshButton);
		} else {
			_args.win.activity.onCreateOptionsMenu = onCreateCineMenu;
		}
		
		// create table view  
		var tableView = Titanium.UI.createTableView();	
		if (movies.osname == 'android') {
			tableView.backgroundColor = '#58595B';
		}
		else {
			tableView.backgroundColor = '#ffffff';
			tableView.borderColor = '#fff';
			tableView.separatorColor = '#fff';		
		}
		
		movies.ui.indicator.openIndicator();
			
		// get estrenos		
		var row = null;		

		var estrenos = pelicula.getEstrenos({
			host: movies.WSHOST, 
			success: buildRows,
			movies: movies 	
		});
		

		// listener
		tableView.addEventListener('click', function(e) {
			if (e.rowData.movieId) {
				Ti.API.log('Memoria disponible ' + Ti.Platform.availableMemory);    

				// destruyo la ventana previa
				var winDescripcion = Titanium.UI.createWindow({ backgroundColor:'#fff'});

				winDescripcion.title = e.rowData.titulo;

				// Pelicula view
				winDescripcion.add(peliculaDetailView.build({titulo: e.rowData.titulo, movieId: e.rowData.movieId, win: winDescripcion, movies: movies}));

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

		if (movies.osname!='android') {
			refreshButton.addEventListener('click', function(e) {
				reload();
			});
		}


		// functions

		var reload = function() {
			var movies = _args.movies;	
			tableView.setData([]);
			movies.ui.indicator.openIndicator();

			var estrenos = pelicula.getEstrenos({
				host: movies.WSHOST, 
				success: buildRows,
				movies: movies 	
			});
		};

		var onCreateCineMenu = function(e) {
			var movies = _args.movies;	
			var menu = e.menu;			
			refreshCines = menu.add({title : 'Actualizar', tableView: tableView});
			refreshCines.addEventListener('click', function(e) {
				reload();
			});
					
		};

		function buildRows(mvs) {
			
			var movies = _args.movies;	 
			
				
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

			tableView.setData(data);
			movies.ui.indicator.closeIndicator();
		} // end function
		
		
		return tableView;
		
	}; // end function

	this.buildView = buildView;


}	