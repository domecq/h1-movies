Ti.include(
	'h1/conf.js',
	'h1/movies.js',
	'h1/activityIndicator.js'
	);
	
// tengo que agregar un listener para poder capturar las variables de cada row porque estan fuera de scope

Ti.App.addEventListener('passValues', function(event) {
  var movieId = event.movieId;
  var titulo = event.titulo;
});

var win = Titanium.UI.currentWindow;

// creo una vista scrollable
var scrollViewCine = Titanium.UI.createScrollView({
	contentWidth:'auto',
	contentHeight:'auto',
	top:0,
	showVerticalScrollIndicator:true,
	showHorizontalScrollIndicator:true
});

// creo la vista para el detalle

var viewDetalleCine = Ti.UI.createView({
	backgroundColor:'#fff',
	borderRadius:10,
	width:Ti.Platform.displayCaps.platformWidth,
	height:2000,
	top:10
});

scrollViewCine.add(viewDetalleCine);


function detalleCine() {
	
	// Open the webservice
	var client = Ti.Network.createHTTPClient();
	client.open('GET', WSHOST + '/cines/' + Titanium.UI.currentWindow.movieId);
	activityIndicator.show();

	client.onerror = function(e) {
		Titanium.UI.createAlertDialog({title:'Error',message:e.error}).show();
	};


	client.onload = function() {
		
		//var json = JSON.parse(this.responseData);
		var json = eval('('+this.responseText+')');

		var movie = json[0];		
		var nombre = movie.nombre;
		var direccion = movie.direccion;
		var localidad = movie.localidad;		
		var peliculas = json[1].peliculas;
		var imagen = 'cine.png';

		// creo la foto

		var photo = Titanium.UI.createImageView({ 
			image: imagen,
			left:10,
			top:20,
			height:60,
			width:60
		})
		
		scrollViewCine.add(photo);		
		

		// nombre del cine
		var movieName = Ti.UI.createLabel({
			color:'#576996',
			font:{fontSize:16,fontWeight:'bold', fontFamily:'Arial'},
			left: 90,
			top:35,
			height: 27	 ,
			width: Ti.Platform.displayCaps.platformWidth  - 70,
			text: nombre
		});
		scrollViewCine.add(movieName);
		
		

		var fs = 14;
		var w = 200;
		
		if (Titanium.Platform.name == 'android') {
			// HVGA
			if ( Ti.Platform.displayCaps.platformWidth == 320 ) {
				fs = 13;					
			} else {					
				fs = 15;
			}
			
		}
		
		var descripcion = direccion + ' ' + localidad ;
		var top = descripcion.length/2.5;
		
		top = top + (Math.abs(top - 90));

		
		// creo la descripcion
		var description = Ti.UI.createLabel({
			color:'#222',
			font:{fontSize:fs,fontWeight:'normal', fontFamily:'Arial'},
			left:20,
			top: top,
			height: 30,
			width: Ti.Platform.displayCaps.platformWidth - 20,
			clickName:'description',
			text: descripcion
		});
			
		scrollViewCine.add(description);	
		
		//fs = fs + 1;

		for (var i=0;i<peliculas.length;i++ ) {
			
			var titulo = peliculas[i].titulo;
			var horarios = peliculas[i].horas;
			var pelicula_id = peliculas[i].pelicula_id;
			var ancho = Ti.Platform.displayCaps.platformWidth - 30;
			var alto = Math.floor(horarios.length / ancho) + 1;
			Ti.API.info(alto);
			Ti.API.info(ancho);
		
			var movieTitulo = Ti.UI.createLabel({
				color:'#576996',
				font:{fontSize: fs,fontWeight:'bold', fontFamily:'Arial'},
				left:20,
				top: 140 + (i*alto*fs*4) ,
				height: alto*fs+10,
				width: ancho,
				text: titulo 
			});
			
			scrollViewCine.add(movieTitulo);
			
			// creo los horarios
			var movieHorarios = Ti.UI.createLabel({
				color:'#222',
				font:{fontSize:fs,fontWeight:'normal', fontFamily:'Arial'},
				left:20,
				top: 160 + (i*alto*fs*4),
				height: alto*fs+10,
				width: ancho,
				clickName:'description',
				text: horarios
			});

			scrollViewCine.add(movieHorarios);	
			

		}

		
		// oculto el indicador de estado
		activityIndicator.hide();		
		win.add(scrollViewCine);
				
	};
	
	client.send();
	

}

activityIndicator.message = 'Cargando ' + Titanium.UI.currentWindow.titulo ;
win.add(activityIndicator);

detalleCine();
