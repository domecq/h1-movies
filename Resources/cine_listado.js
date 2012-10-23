Ti.include(
	'h1/conf.js',
	'h1/movies.js',
	'h1/activityIndicator.js'
	);


var hWhere = 40;
var fsWhere = 13;
var wWhereTxt = 300;
var hWhereTxt = 45;


function cineList() {
	var win = Titanium.UI.currentWindow;
	
	activityIndicator.message = 'Cargando Cines ...';
	// en ios necesita estar attachado a una ventana
	if (Ti.Platform.name != 'android')
		win.add(activityIndicator);

	// table view cines

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

	// create a var to track the active row
	var currentRow = null;
	var currentRowIndex = null;

	// Open the webservice
	var client = Ti.Network.createHTTPClient();
	client.setTimeout(30000);

	//latitude = -34.589905;
	//longitude = -58.405638;
	latitude  = Ti.App.latitudeCine;
	longitude = Ti.App.longitudeCine;
	client.open('GET',  WSHOST + '/cines/findnear/' + latitude + '/' + longitude);

	activityIndicator.show();
	client.send();
	client.onerror = function(e) {
		Titanium.UI.createAlertDialog({title:'Problemas',message:ERROR_CONNECTION}).show();
	};
	

	client.onload = function() {
		
		//var json = JSON.parse(this.responseData);
		var json = eval('('+this.responseText+')');

		// create the rest of the rows
		for (var c=0; c<json.length; c++) {
		
			var movie = json[c];
			//Ti.API.info(json[c]);
			var cine_id = movie.id;
			var imagen = 'cine.png';
			var nombre = movie.nombre;
			
			if (cine_id != 0 ) { 
			
				// creo la row
				var row = Ti.UI.createTableViewRow({hasChild:true,movieId: cine_id, titulo: nombre });
				row.backgroundSelectedColor = '#fff';
				row.height = 80;
				row.className = 'datarow';
				row.clickName = 'row';
				//Ti.API.info(imagen);

				// creo la foto

				var photo = Titanium.UI.createImageView({ 
					image: imagen,
					top:12,
					left:10,
					width:50,
					height:50,
					clickName:'photo'
				})
			
				row.add(photo);

				// creo el nombre del cine
				var cineName = Ti.UI.createLabel({
					color:'#576996',
					font:{fontSize:16,fontWeight:'bold', fontFamily:'Arial'},
					left:80,
					top:10,
					height:20,
					width:200,
					clickName:'cineName',
					text: nombre
				});

				row.filter = cineName.text;
				row.add(cineName);

				var fs = 14;
				var w = 200;
			
				if (Titanium.Platform.name == 'android') {
					// HVGA
					if ( Ti.Platform.displayCaps.platformWidth == 320 ) {
						fs = 13;
						w =  200;					
					} else {					
						fs = 15;
						w =  300;
					}
				
				}
			
				// creo la descripcion
				var description = Ti.UI.createLabel({
					color:'#222',
					font:{fontSize:fs,fontWeight:'normal', fontFamily:'Arial'},
					left:80,
					top:26,
					height:55,
					width:w,
					clickName:'description',
					text: nombre
				});
				row.add(description);
		
				data.push(row);	
				
			}

		}
		
		activityIndicator.hide();
		
		//
		// create table view (
		//
		tableView = Titanium.UI.createTableView({
			data:data,
			filterAttribute:'filter',
			backgroundColor:'white'
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
		
	};
}
cineList();	


	