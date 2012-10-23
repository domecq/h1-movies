
var winEstrenos = Titanium.UI.createWindow({  
    title:'Estrenos',
    backgroundColor:'#fff'
});
var tabEstrenos = Titanium.UI.createTab({  
    icon:'images/movie1.png',
    title:'Estrenos',
    window: winEstrenos
});

tabGroup.addTab(tabEstrenos); 

// creo la primer row en donde dice la ubicacion actual
var hWhere = 55;
var fsWhere = 13;
var wWhereTxt = 300;
var hWhereTxt = 45;

var ancho = Ti.Platform.displayCaps.platformWidth;
var osname = Titanium.Platform.name;

if (osname == 'android') {
	hWhere= 40; 
	fsWhere= 13;
	hWhereTxt = 'auto'; 
	wWhereTxt='auto';
}

var whereAmIRow = Ti.UI.createTableViewRow();
var whereAmIText = Titanium.UI.createLabel({
	text:'Tu ubicación es ...',
	color:'#fff',
	textAlign:'center',
	font:{fontSize:fsWhere},
	width: wWhereTxt,
	height: hWhereTxt
});
whereAmIRow.backgroundColor = '#9c9a9c';
whereAmIRow.backgroundSelectedColor = '#fa0100';
whereAmIRow.height = hWhere;
whereAmIRow.className = 'header';
whereAmIRow.add(whereAmIText);	

// Cuando Clickee lo que podemos hacer es que cambie la ubicación por si quiere ir al cine 
// a otro lugar que no sea el cercano
whereAmIRow.addEventListener('click',function()
{
	Titanium.UI.createAlertDialog({title:'Cambiar de ubicación',message:'Hola mono!'}).show();
});


function estrenos() {
	
	activityIndicator.message = 'Cargando Estrenos ...';
	// en ios necesita estar attachado a una ventana
	if (osname != 'android')
		winEstrenos.add(activityIndicator);
	

	// table view estrenos

	var tableView;
	var data = [];
		
	// create first row
	data.push(whereAmIRow);

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
			font:{fontSize:16, fontWeight:'bold'},
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
	
	client.open('GET',  WSHOST + '/peliculas/estrenos');
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
			var brief = movie.brief;
			var imagen = movie.imagen;
			var titulo = movie.titulo;
			
			// creo la row
			var row = Ti.UI.createTableViewRow({hasChild:true,movieId: pelicula_id, titulo: titulo });
			row.backgroundSelectedColor = '#fff';
			row.height = 102;
			row.className = 'datarow';
			row.clickName = 'row';
			//Ti.API.info(imagen);

			// creo la foto

			var photo = Titanium.UI.createImageView({ 
				image: imagen,
				left:0,
				width:100,
				height:100,
				clickName:'photo'
			})
		
			var photoScale = Titanium.UI.createImageView({ 
				image: imagen,
				left:0,
				width: ancho,
				height: ancho,
				clickName:'photo'
			})
			
			var crop = Titanium.UI.createView({
				width: ancho,
				height: 110
			});
			
			crop.add(photoScale);
			
			var croppedImage = crop.toImage();
			 
			// make an imageView containing the image Blob
			var imageView = Titanium.UI.createImageView({
			    image:croppedImage,
			    width: row.width, height: 110
			});
			 
			// add it to the window
			row.add(imageView);			
			
			//row.add(photo);
			
			var fs = 15;
			var fsw = 7.5;

			
			if (osname == 'android') {
				// HVGA
				if ( ancho == 320 ) {
					fs = 13;
					fsw = 6.5;											
				} else {					
					fs = 15;
					fsw = 7.5;					
				}
				
			}
			var w = ancho - 135;
			var fsName = fs;
												
			// creo el titulo de la pelicula
			var max = (30/(fsName/2))*(w/(fsName/2));
			
			if (osname=='android') {									
				if (titulo.length>=max)
					titulo = titulo.substring(0,max) + '...';
			}			
			var movieName = Ti.UI.createLabel({
				color:'#576996',
				font:{fontSize:fsName,fontWeight:'bold', fontFamily:'Arial'},
				left:107,
				top:2,
				height:30,
				width: w,
				clickName:'movieName',
				text: titulo
			});

			row.filter = movieName.text;
			row.add(movieName);
			
			// creo la descripcion
			var max = Math.floor((60/(fs-3))*(w/(fs-3)));
			
			if (osname=='android') {
				if (brief.length>=max)
					brief = brief.substring(0,max) + '...';
			}
			
			var description = Ti.UI.createLabel({
				color:'#222',
				font:{fontSize:fs,fontWeight:'normal', fontFamily:'Arial'},
				left:107,
				top:33,
				height:60,
				width: w,
				clickName:'description',
				text: brief
			});
			row.add(description);
		
			data.push(row);	

		}
		
		activityIndicator.hide();
		
		if (osname == 'android') {
			turnOffGPSListeners(Ti.Android.currentActivity);
		}
		
		
		
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

				tabEstrenos.open(winDescripcion,{animated:true});
				
		        // para disparar el evento tiene que estar creada la ventana
				Ti.App.fireEvent('passValues', { movieId: e.rowData.movieId, titulo: e.rowData.titulo});

			}	
		});
		
		winEstrenos.add(tableView);
		
	};
}
 

