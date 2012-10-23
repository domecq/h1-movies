// 
// EstrenoView class
//

exports.EstrenoView = function(args) {
		
	var _win = Ti.UI.createWindow(args.win)
	var movies = args.movies;
	var navController = args.controller;
	
	// local variables	
			
	// create a var to track the active row
	var currentRow = null;
	var currentRowIndex = null;
	
	// create table view  
	var tableView = Titanium.UI.createTableView({
				filterAttribute:'filter',
				backgroundColor:'#58595B'
	});;
		
	
	//movies.ui.activityIndicator.message = 'Cargando estrenos ...';
	
	//if (movies.osname != 'android')
	//	_win.add(movies.ui.activityIndicator);
		
	var Pelicula = require('model/Pelicula').Pelicula;	
	// instance
	var peli = new Pelicula();

	// get estrenos		
	var row = null;		
	var estrenos = peli.getEstrenos({
		host: movies.WSHOST, 
		success: function (mvs) {	 
			
			var data = [];

			for (var c=0; c<mvs.length; c++) {
			
				var movie = mvs[c];
				var pelicula_id = movie.pelicula_id;
				var brief = movie.brief;
				var imagen = movie.imagen;
				var titulo = movie.titulo;
				// create row				
				row = movies.ui.createRow(imagen, pelicula_id, titulo);
				row.navController = navController;
	
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
			
			tableView.data = data;
			_win.add(tableView);
			//_win.open();
		} // end function
	});

	// listener
	tableView.addEventListener('click', function(e)
	{
		if (e.rowData.movieId)
		{
			// creo la windows de la descripcion
			winDescripcion = Titanium.UI.createWindow({
				url:"pelicula_descripcion.js",
				backgroundColor:'#fff',					
				title:e.rowData.titulo,
				controller: e.rowData.navController 
			});

			win = e.navController.push(winDescripcion);

			var Descripcion = require('model/PeliculaDetailView').PeliculaDetailView;
				
			// instance
			var peliDetail = new PeliculaDetailView();


			win.movieId = e.rowData.movieId;
			win.titulo = e.rowData.titulo;
			
	        // para disparar el evento tiene que estar creada la ventana
			Ti.App.fireEvent('passValues', { movieId: e.rowData.movieId, titulo: e.rowData.titulo});				
			
			
			if (movies.osname=="android" ) {
				movies.ui.tabs.currentTab.add(winDescripcion);
				winDescripcion.open({animated: true});
				win.addEventListener('android:back',function(e){
					winDescripcion.close();
					return false;
				});					
				
			}	
						
			if (movies.osname=="iphone" || movies.osname == "ipad" ) {
				movies.ui.tabs.currentTab.open(winDescripcion,{animated:true});
			}				

		}	
	});	 // end listener

	return _win;
	
}; // end function

