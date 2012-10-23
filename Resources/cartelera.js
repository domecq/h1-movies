// ventana y tab

var winCartelera = Titanium.UI.createWindow({  
    title:'Cartelera',
    backgroundColor:'#fff'
});
var tabCartelera = Titanium.UI.createTab({  
    icon:'images/cartelera.png',
    title:'Cartelera',
    window:winCartelera
});

tabGroup.addTab(tabCartelera);

// creo la primer row en donde dice la ubicacion actual
var hWhere = 55;
var fsWhere = 13;
var wWhereTxt = 300;
var hWhereTxt = 45;

if (Titanium.Platform.name == 'android') {
	hWhere = 60; 
	fsWhere=18;
	hWhereTxt = 'auto'; 
	wWhereTxt='auto';	
}

var whereAmIRowCartelera = Ti.UI.createTableViewRow();
var whereAmITextCartelera = Titanium.UI.createLabel({
	text:'Tu ubicación es ...',
	color:'#fff',
	textAlign:'center',
	font:{fontSize:fsWhere},
	width: wWhereTxt,
	height: hWhereTxt
});
whereAmIRowCartelera.backgroundColor = '#9c9a9c';
whereAmIRowCartelera.backgroundSelectedColor = '#fa0100';
whereAmIRowCartelera.height = hWhere;
whereAmIRowCartelera.className = 'header';
whereAmIRowCartelera.add(whereAmITextCartelera);	

// Cuando Clickee lo que podemos hacer es que cambie la ubicación por si quiere ir al cine 
// a otro lugar que no sea el cercano
whereAmIRowCartelera.addEventListener('click',function()
{
	Titanium.UI.createAlertDialog({title:'Cambiar de ubicación',message:'Hola mono!'}).show();
});


function cartelera() {
	
	activityIndicator.message = 'Cargando Cartelera ...';
	// en ios necesita estar attachado a una ventana
	if (Ti.Platform.name != 'android')
		winCartelera.add(activityIndicator);
	

	// table view cartelera

	var tableView;
	var data = [];
	
	
	// create first row
	data.push(whereAmIRowCartelera);

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
			font:{fontSize:26, fontWeight:'bold'},
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
	
	client.open('GET',  WSHOST + '/peliculas/cartelera');
	activityIndicator.show();
	client.send();
	
	client.onerror = function(e) {
		Titanium.UI.createAlertDialog({title:'Error',message:e.error}).show();
	};
	

	client.onload = function() {
		
		//var json = JSON.parse(this.responseData);
		var json = eval('('+this.responseText+')');

		// create the rest of the rows
		for (var c=0; c<json.length; c++) {
		
			var movie = json[c];
			//Ti.API.info(json[c]);
			var pelicula_id = movie.id;
			var descripcion = movie.descripcion;
			var imagen = movie.imagen;
			var titulo = movie.titulo;
			
			// creo la row
			var row = Ti.UI.createTableViewRow({hasChild:true,movieId: pelicula_id, titulo: titulo });
			row.backgroundSelectedColor = '#fff';
			row.height = 110;
			row.className = 'datarow';
			row.clickName = 'row';
			//Ti.API.info(imagen);

			// creo la foto

			var photo = Titanium.UI.createImageView({ 
				image: imagen,
				top:1,
				left:1,
				width:100,
				height:100,
				clickName:'photo'
			})
			
			row.add(photo);
			
			var fs = 15;
			var w = 200;
			
			if (Titanium.Platform.name == 'android') {
				// HVGA
				if ( Ti.Platform.displayCaps.platformWidth == 320 ) {
					fs = 13;
					w =  200;					
				} else {					
					fs = 18;
					w =  330;
				}
				
			}
			
			// creo el titulo de la pelicula
			if (titulo.length>=35)
				titulo = titulo.substring(0,35) + '...';
			
			var fsName = fs + 2;
			var movieName = Ti.UI.createLabel({
				color:'#576996',
				font:{fontSize:fsName,fontWeight:'bold', fontFamily:'Trebuchet MS'},
				left:107,
				top:2,
				height:28,
				width:w,
				clickName:'movieName',
				text: titulo
			});

			row.filter = movieName.text;
			row.add(movieName);
						
			// creo la descripcion
			if (descripcion.length>=100)
				descripcion = descripcion.substring(0,100) + '...';
			
			var description = Ti.UI.createLabel({
				color:'#222',
				font:{fontSize:fs,fontWeight:'normal', fontFamily:'Trebuchet MS'},
				left:107,
				top:27,
				height:80,
				width:w,
				clickName:'description',
				text: descripcion
			});
			row.add(description);
		
			data.push(row);	

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
			// use rowNum property on object to get row number
			// var rowNum = e.index;
			// var updateRow = createUpdateRow('You clicked on the '+e.source.clickName);
			// tableView.updateRow(rowNum,updateRow,{animationStyle:Titanium.UI.iPhone.RowAnimationStyle.LEFT});

			if (e.rowData.movieId)
			{
				// creo la windows de la descripcion
				var winDescripcion = Titanium.UI.createWindow({
					url:"pelicula_descripcion.js",
					backgroundColor:'#fff',					
					title:e.rowData.titulo
				});

				winDescripcion.movieId = e.rowData.movieId;
				winDescripcion.titulo = e.rowData.titulo;

				tabCartelera.open(winDescripcion,{animated:true});
				
		        // para disparar el evento tiene que estar creada la ventana
				Ti.App.fireEvent('passValues', { movieId: e.rowData.movieId, titulo: e.rowData.titulo});

			}	
		});
		
		winCartelera.add(tableView);
		
	};

}

/*
tabCartelera.addEventListener('focus', function(e) {
	cartelera();
});

*/