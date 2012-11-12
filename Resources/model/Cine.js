// Class Cine

exports.Cine = function(_args) {
	
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

function to_kilometer(num) {
	return roundNumber(num * 1.609344,2);	
}

function roundNumber(rnum, rlength) { // Arguments: number to round, number of decimal places
	var newnumber = Math.round(rnum*Math.pow(10,rlength))/Math.pow(10,rlength);
	return parseFloat(newnumber); 
}


var findNear = function(args) {
						
	// Open the webservice
	var client = Ti.Network.createHTTPClient();
	client.setTimeout(30000);		
	
	client.onerror = function(e) {
		Titanium.UI.createAlertDialog({title:'Problemas',message: 'Hay problemas con la conexión'}).show();	 
		args.movies.ui.indicator.closeIndicator();	
	};	

	client.onload = function() {
				
		var data = [];
		//var json = JSON.parse(this.responseData);
		var json = eval('('+this.responseText+')');

		// create the rest of the rows
		for (var c=0; c<json.length; c++) {
			var cine = json[c];
			if ( cine.latitude != null && cine.longitude!= null ) {
				var cine_id = cine.id;
				var imagen = 'cine.png';
				var nombre = cine.nombre;
				var distancia ;
				if (cine.distance!=null) 
					distancia = cine.distance;
				else
					distancia = 0;			
				var distance = to_kilometer(distancia);
				var lat = cine.latitude;
				var lon = cine.longitude;
				data.push({cine_id: cine_id, nombre: nombre, imagen: imagen, distancia: distancia, lat: lat, lon: lon});
			}						
		}
		
		args.success(data);			
	};
	var url;
	if (typeof args.pelicula_id == 'undefined') 
		url = args.host + '/cines/findnear/' + args.latitude + '/' + args.longitude;
	else
		url = args.host + '/cines/findwhere/' + args.latitude + '/' + args.longitude  + '/' + args.pelicula_id;			

	client.open('GET', url);		
	client.send();			
			
}

// public interface

exports.Cine.prototype.getCine = function(args) {
						
	// Open the webservice
	var client = Ti.Network.createHTTPClient();
	client.setTimeout(30000);		
	
	client.onerror = function(e) {
		Titanium.UI.createAlertDialog({title:'Problemas',message: 'Hay problemas con la conexión'}).show();	 
		args.movies.ui.indicator.closeIndicator();	
	};	

	client.onload = function() {
				
		var data = [];
		//var json = JSON.parse(this.responseData);
		var json = eval('('+this.responseText+')');

		var cine = json[0];
	
		var nombre = cine.nombre;
		var direccion = cine.direccion;
		var localidad = cine.localidad;		
		var peliculas = json[1].peliculas;
		var imagen = 'cine.png';
		data.push({ nombre: nombre, imagen: imagen, direccion: direccion, localidad: localidad, peliculas: peliculas});
						
		args.success(data);			
	};
	var url = args.host + '/cines/' + args.cine_id;

	client.open('GET', url);		
	client.send();			
			
}


exports.Cine.prototype.getCines = function(_args) {
	findNear(_args);
}
 