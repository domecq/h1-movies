
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 4;

var locationAdded = false;


	
if (Titanium.Platform.name == 'iPhone OS') {
	// a partir de la version 3.2 necesitas especificar un proposito
	Ti.Geolocation.purpose = "GPS user coordinates";
}

// Solo para android
function turnOffGPSListeners(currAct) {	
	//  as the destroy handler will remove the listener, only set the pause handler to remove if you need battery savings
	/*
	currAct.addEventListener('pause', function(e) {
		Ti.API.info("pause event received");
		if (locationAdded) {
			Ti.API.info("removing location callback on pause");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});
	*/
	currAct.addEventListener('destroy', function(e) {
		if (locationAdded) {
			Ti.API.info("removing location callback on destroy");
			Titanium.Geolocation.removeEventListener('location', locationCallback);
			locationAdded = false;
		}
	});
	/*
	currAct.addEventListener('resume', function(e) {
		Ti.API.info("resume event received");
		if (!locationAdded) {
			Ti.API.info("adding location callback on resume");
			Titanium.Geolocation.addEventListener('location', locationCallback);
			locationAdded = true;
		}
	});
	*/
}


// geolocation listeners

Titanium.Geolocation.getCurrentPosition(function(e) {
    if (e.error) {
        return;
    }
	
	longitude = e.coords.longitude;
	latitude = e.coords.latitude;
	altitude = e.coords.altitude;
	heading = e.coords.heading;
	accuracy = e.coords.accuracy;
	speed = e.coords.speed;
	timestamp = e.coords.timestamp;
	altitudeAccuracy = e.coords.altitudeAccuracy;
	
	//Ti.API.info('getCurrent ' + latitude + ' ' + longitude  );
	
	locationAdded = true;
	
	whereAmI(latitude, longitude);
	updateMap(latitude, longitude);
	
});


var locationCallback = function(e) {
	if (e.error) {
		// manage the error
		return;
	}

	longitude = e.coords.longitude;
	latitude = e.coords.latitude;
	
	altitude = e.coords.altitude;
	heading = e.coords.heading;
	accuracy = e.coords.accuracy;
	speed = e.coords.speed;
	timestamp = e.coords.timestamp;
	altitudeAccuracy = e.coords.altitudeAccuracy;

    // again we use the gathered data
	// var win = Titanium.UI.currentWindow;

	//Ti.API.info('location ' + latitude + ' ' + longitude + ' ' + winEstrenos.title);
	
	locationAdded = true;
	
	whereAmI(latitude, longitude);
		
};

Titanium.Geolocation.addEventListener('location', locationCallback) ;


function whereAmI(latitude, longitude) {
	
	// Busco la direccion

	var xhr = Ti.Network.createHTTPClient();
	xhr.setTimeout(60000);
	xhr.open('GET',  WSHOST + '/cines/whereami/' + latitude + '/' + longitude );
	//Ti.API.info(WSHOST + '/cines/whereami/' + latitude + '/' + longitude );
	xhr.send();
	
	xhr.onerror = function(e) {
		Titanium.UI.createAlertDialog({title:'Error',message:e.error}).show();
	};	

	xhr.onload = function() {	
		var json = eval('('+this.responseText+')');
		//var json = JSON.parse(this.responseData);
		//Ti.API.info(json);
		
		//whereAmIText.text = 'Tu ubicación es ' + json.direccion;
		whereAmITextCartelera.text = 'Tu ubicación es ' + json.direccion;
		//whereAmITextCines.text = 'Tu ubicación es ' + json.direccion;
	};
	
}

function updateMap(latitude, longitude) {
}