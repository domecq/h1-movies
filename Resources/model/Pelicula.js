// Class Pelicula

exports.Pelicula = function() {
	
	this.handleError = function(_e,_xhr,_custom) {
		if (_custom) {
			_custom(e,xhr);
		}
		else {
			Ti.API.error('Error: '+JSON.stringify(_e)+'\nServer response: '+_xhr.responseText);
			tt.ui.alert('Error', 'Hay problemas con la conexión');
			//Ti.App.fireEvent('app:hide.loader');
		}
	}	
	
};

var getPeliculas = function(args) {
						
	// Open the webservice
	var client = Ti.Network.createHTTPClient();
	client.setTimeout(30000);		
	
	client.onerror = function(e) {
		Titanium.UI.createAlertDialog({title:'Problemas',message: 'Hay problemas con la conexión'}).show();	 
	};	

	client.onload = function() {
				
		var data = [];
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
			var descripcion = movie.descripcion;
			data.push({pelicula_id: pelicula_id, brief: brief, imagen: imagen, titulo: movie.titulo, descripcion: descripcion});						

		}
		
		args.success(data);			
	};
	var url = args.host + '/peliculas/';
	if (args.kind != undefined)
		url = url + args.kind;
	else
		url = url + args.movie_id;
			
	client.open('GET', url);		
	client.send();			
			
}

exports.Pelicula.prototype.getEstrenos = function(args) {
	getPeliculas({kind:'estrenos', host: args.host, success: args.success});
}

exports.Pelicula.prototype.getCartelera = function(args) {
	getPeliculas({kind:'cartelera', host: args.host, success: args.success});
}
 
exports.Pelicula.prototype.getPelicula = function(args) {
	getPeliculas({movie_id: args.movie_id, host: args.host, success: args.success});
}
