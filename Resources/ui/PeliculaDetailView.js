//
// PeliculaDetailView class
//

exports.PeliculaDetailView = function(args) {
	//var win = Titanium.UI.currentWindow;
	// creo la vista para el detalle
	var movies = args.movies;
	movieId = args.movieId;
	
	var viewDetalle = Ti.UI.createView({
		backgroundColor:'#fff',
		borderRadius:10,
		width:Ti.Platform.displayCaps.platformWidth,
		height:2000,
		top:10
	});
	var Pelicula = require('model/Pelicula').Pelicula;
	var peli = new Pelicula();
	peli.getPelicula({
		host: movies.WSHOST, 
		success: function (mvs) {	 
			
			var movie = mvs[0];
			var pelicula_id = movie.id;
			var descripcion = movie.descripcion;
			var imagen = movie.imagen;
			var titulo = movie.titulo;
			
		// creo el titulo de la pelicula
		var fs = 16;
		var fsw = 8.6; // el ancho en pixeles para ios
		var top = 12;
		
		if (Titanium.Platform.name == 'android') {
			// HVGA
			if ( Ti.Platform.displayCaps.platformWidth == 320 ) {
				fs = 15;
				fsw = 7.4;					
			} else {					
				fs = 20;
				fsw = 10.5;
			}			
		}
		
		var tableView;
		var data = [];
	
		// create update row (used when the user clicks on the row)
		function createUpdateRow(text)
		{
			var updateRow = Ti.UI.createTableViewRow();
			updateRow.backgroundColor = '#13386c';
			updateRow.backgroundSelectedColor = '#13386c';
	
			// add custom property to identify this row
			updateRow.isUpdateRow = true;
			var updateRowText = Ti.UI.createLabel({
				color:'#fff',
				font:{fontSize:20, fontWeight:'bold'},
				text:text,
				width:'auto',
				height:'auto'
			});
			updateRow.className = 'updated_row';
			updateRow.add(updateRowText);
			return updateRow;
		}				

		var currentRow = null;
		var currentRowIndex = null;
		
		
		// titulo de la pelicula		
		var movieName = Ti.UI.createLabel({
			color:'#576996',
			font:{fontSize:fs,fontWeight:'bold', fontFamily:'Arial'},
			left: (Ti.Platform.displayCaps.platformWidth / 2) - (titulo.length*fsw/2),
			top: 2,
			height:30,
			width: titulo.length * fs,
			text: titulo
		});
		// creo la row para el titulo
		//var row = Ti.UI.createTableViewRow({hasChild:true,movieId: cine_id, titulo: nombre });
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
			left: (Ti.Platform.displayCaps.platformWidth / 2) - 150,
			top: 5,
			height:300,
			width:300
		})

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
				
		if (Titanium.Platform.name == 'android') {
			// HVGA
			if ( Ti.Platform.displayCaps.platformWidth == 320 ) {
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
			left:46,
			top: 1,
			height: 50,
			width: 'auto',
			clickName:'horario',
			text: 'Cines y horarios' 
		});
		
		// creo el icono	
		var icono = Titanium.UI.createImageView({ 
			image: 'images/horarios.png',
			left: 12.5,
			top: 12,
			height:25,
			width:26
		})
		

		var row = Ti.UI.createTableViewRow({hasChild:true});
		row.backgroundSelectedColor = '#fff';
		row.borderColor = '#ccc';
		row.height = 50;
		row.className = 'datarow';
		row.clickName = 'row';		
		row.add(horario);
		row.add(icono);
		data.push(row);	
			
		
		// creo el tableView con su listener
		tableView = Titanium.UI.createTableView({
			data:data,
			filterAttribute:'filter',
			backgroundColor:'white',
			separatorColor:'#fff',
		});
		
		tableView.addEventListener('click', function(e)
		{
			// Ti.API.info('table view row clicked - source ' + e.source);

			if (e.rowData.movieId)
			{
				// creo la windows de la descripcion
				var winDescripcion = Titanium.UI.createWindow({
					url:"cine_descripcion.js",
					backgroundColor:'#fff',					
					title:e.rowData.titulo
				});

				winDescripcion.movieId = e.rowData.movieId;
				winDescripcion.titulo = e.rowData.titulo;

				Titanium.UI.currentTab.open(winDescripcion,{animated:true});
				
		        // para disparar el evento tiene que estar creada la ventana
				Ti.App.fireEvent('passValues', { movieId: e.rowData.movieId, titulo: e.rowData.titulo});

			}	
		});
		win.add(tableView);	
		// oculto el indicador de estado		
		activityIndicator.hide();		

				
		}
			
	});
	

	client.onload = function() {
		
		//var json = JSON.parse(this.responseData);
		var json = eval('('+this.responseText+')');
		var movie = json[0];
		var pelicula_id = movie.id;
		var descripcion = movie.descripcion;
		var imagen = movie.imagen;
		var titulo = movie.titulo;
		
		

		// creo el titulo de la pelicula
		var fs = 16;
		var fsw = 8.6; // el ancho en pixeles para ios
		var top = 12;
		
		if (Titanium.Platform.name == 'android') {
			// HVGA
			if ( Ti.Platform.displayCaps.platformWidth == 320 ) {
				fs = 15;
				fsw = 7.4;					
			} else {					
				fs = 20;
				fsw = 10.5;
			}			
		}
		
		var tableView;
		var data = [];
	
		var currentRow = null;
		var currentRowIndex = null;
		
		
		// titulo de la pelicula		
		var movieName = Ti.UI.createLabel({
			color:'#576996',
			font:{fontSize:fs,fontWeight:'bold', fontFamily:'Arial'},
			left: (Ti.Platform.displayCaps.platformWidth / 2) - (titulo.length*fsw/2),
			top: 2,
			height:30,
			width: titulo.length * fs,
			text: titulo
		});
		// creo la row para el titulo
		//var row = Ti.UI.createTableViewRow({hasChild:true,movieId: cine_id, titulo: nombre });
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
			left: (Ti.Platform.displayCaps.platformWidth / 2) - 150,
			top: 5,
			height:300,
			width:300
		})

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
				
		if (Titanium.Platform.name == 'android') {
			// HVGA
			if ( Ti.Platform.displayCaps.platformWidth == 320 ) {
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
			left:46,
			top: 1,
			height: 50,
			width: 'auto',
			clickName:'horario',
			text: 'Cines y horarios' 
		});
		
		// creo el icono	
		var icono = Titanium.UI.createImageView({ 
			image: 'images/horarios.png',
			left: 12.5,
			top: 12,
			height:25,
			width:26
		})
		

		var row = Ti.UI.createTableViewRow({hasChild:true});
		row.backgroundSelectedColor = '#fff';
		row.borderColor = '#ccc';
		row.height = 50;
		row.className = 'datarow';
		row.clickName = 'row';		
		row.add(horario);
		row.add(icono);
		data.push(row);	
			
		
		// creo el tableView con su listener
		tableView = Titanium.UI.createTableView({
			data:data,
			filterAttribute:'filter',
			backgroundColor:'white',
			separatorColor:'#fff',
		});
		
		tableView.addEventListener('click', function(e)
		{
			// Ti.API.info('table view row clicked - source ' + e.source);

			if (e.rowData.movieId)
			{
				// creo la windows de la descripcion
				var winDescripcion = Titanium.UI.createWindow({
					url:"cine_descripcion.js",
					backgroundColor:'#fff',					
					title:e.rowData.titulo
				});

				winDescripcion.movieId = e.rowData.movieId;
				winDescripcion.titulo = e.rowData.titulo;

				Titanium.UI.currentTab.open(winDescripcion,{animated:true});
				
		        // para disparar el evento tiene que estar creada la ventana
				Ti.App.fireEvent('passValues', { movieId: e.rowData.movieId, titulo: e.rowData.titulo});

			}	
		});
		win.add(tableView);	
		// oculto el indicador de estado		
		activityIndicator.hide();		

				
	};
	
	client.send();
	

}

activityIndicator.message = 'Cargando ' + Titanium.UI.currentWindow.titulo ;
win.add(activityIndicator);

detalle();
