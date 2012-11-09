
var self = this;

function Geo() {

	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 4;

	self.locationAdded = false;

	// default values
	self.latitude  = -34.569281;
	self.longitude = -58.468939;
	self.altitude  = null;
	self.heading   = null;
	self.accuracy  = null;
	self.speed     = null;
	self.timestamp = null;
	self.altitudeAccuracy = null;
		
	if (Titanium.Platform.name == 'iPhone OS') {
		// a partir de la version 3.2 necesitas especificar un proposito
		Ti.Geolocation.purpose = "GPS user coordinates";
	}

}

// Solo para android
Geo.prototype.turnOffGPSListeners = function(currAct) {	
	currAct.addEventListener('destroy', function(e) {
		if (movies.locationAdded) {
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			movies.locationAdded = false;
		}
	});
}



Geo.prototype.getPosition = function(_callback) {

	
	// geolocation listeners, el getCurrentPostition se dispara una sola vez
	Titanium.Geolocation.getCurrentPosition(function(e) {
	    if (e.error) {
	        alert('Se a producido un error en el GPS');
	        return;
	    }
		
		self.longitude = e.coords.longitude;
		self.latitude = e.coords.latitude;
		self.altitude = e.coords.altitude;
		self.heading = e.coords.heading;
		self.accuracy = e.coords.accuracy;
		self.speed = e.coords.speed;
		self.timestamp = e.coords.timestamp;
		self.altitudeAccuracy = e.coords.altitudeAccuracy;
		
		self.locationAdded = true;

		if (_callback) _callback(e.coords);

		
	});

	// location se dispara cada vez que el gps actualiza su posicion
	Titanium.Geolocation.addEventListener('location', locationCallback) ;

}

Geo.prototype.whereAmI = function(latitude, longitude) {
	
	// Busco la direccion

	var xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(60000);
	xhr.open('GET',  WSHOST + '/cines/whereami/' + movies.latitude + '/' + movies.longitude );

	xhr.send();
	
	xhr.onerror = function(e) {
		Titanium.UI.createAlertDialog({title:'Error',message:e.error}).show();
	};	

	xhr.onload = function() {	
		var json = eval('('+this.responseText+')');
			
		//whereAmIText.text = 'Tu ubicación es ' + json.direccion;
		whereAmITextCartelera.text = 'Tu ubicación es ' + json.direccion;
		//whereAmITextCines.text = 'Tu ubicación es ' + json.direccion;
	};
	
}

Geo.prototype.getLatitude = function (){
	return self.latitude;
}

Geo.prototype.getLongitude = function (){
	return self.longitude;
}

// private
var locationCallback = function(e) {
	if (e.error) {
		// manage the error
		return;
	}

	self.longitude = e.coords.longitude;
	self.latitude = e.coords.latitude;	
	self.altitude = e.coords.altitude;
	self.heading = e.coords.heading;
	self.accuracy = e.coords.accuracy;
	self.speed = e.coords.speed;
	self.timestamp = e.coords.timestamp;
	self.altitudeAccuracy = e.coords.altitudeAccuracy;

	self.locationAdded = true;	
		
};

// public interface
module.exports = Geo;