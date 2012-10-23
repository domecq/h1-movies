var winCines;
var tabCines;


winCines = Titanium.UI.createWindow({  
    title:'Mapa de cines',
    backgroundColor:'#fff'
});
	
tabCines = Titanium.UI.createTab({  
    icon:'images/cines.png',
    title:'Cines',
   	height: 30, 
   	width: 30,
    window:winCines
});

tabGroup.addTab(tabCines);


/**
 *  Cines class
 *  
 */
 function Cines(e) {
	////////////// public properties ////////////////
	this.win = e.win;
	this.tab = e.tab;
	this.mapview = Titanium.Map.createView({
				mapType: Titanium.Map.STANDARD_TYPE,
				animate:true,
				regionFit:true,
				userLocation:true,
				top: 1
			});

	
	////////////// private properties ////////////////
	var mapIsAdded = false;
	
	////////////// public methods ////////////////	
	this.open =  function() {
		this.ui();	
		this.loadData();
	}		
	
} // end class

/**
 *  create Cine's UI
 */		
Cines.prototype.ui = function() {
	
	if (latitude == null || longitude == null ) {
		latitude = -34.569281;
		longitude = -58.468939;
	}
	
	this.mapview.region = {latitude: latitude, longitude: longitude, latitudeDelta:0.04, longitudeDelta:0.04};
	
	// creo el menú para android y el tab nav para ios	
	createCineMenuUI(this.tab,this.win);
}
	
	/**
	 *  load all the data from the servers
	 */
	this.loadData =  function() {
		
		
		activityIndicator.message = 'Cargando Cines ...';
		// en ios necesita estar attachado a una ventana
		if (osname != 'android')
			this.win.add(activityIndicator);
		
		
		// Open the webservice
		var client = Ti.Network.createHTTPClient();
		client.setTimeout(30000);
		
		//latitude = -34.569281;
		//longitude = -58.468939;
		if (latitude == null || longitude == null ) {
			latitude = -34.569281;
			longitude = -58.468939;
		}
	
		client.open('GET',  WSHOST + '/cines/findnear/' + latitude + '/' + longitude);
		//alert(WSHOST + '/cines/findnear/' + latitude + '/' + longitude);
		activityIndicator.show();	
		client.send();
		client.onerror = function(e) {
			Titanium.UI.createAlertDialog({title:'Error',message:e.error}).show();
		};
		
		client['win'] = this.win;
		client['mapview'] = this.mapview;
		
		client.onload = function() {
	
			var json = eval('('+this.responseText+')');
	
			var cineAnnotations = [];
	
			// create the rest of the rows
			for (var c=0; c<json.length; c++) {
				
				var cine = json[c];
				
				if (cine.latitude != null && cine.longitude!= null ) {
					//Ti.API.info(json[c]);
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
								
					if (cine_id != 0 ) { 
						
						var mapParams = {
								latitude: lat,
								longitude: lon,
								title: cine.nombre,
								subtitle: cine.nombre,
								animate:true,
								cineId: cine.id 
							};
							
						if (osname != 'android') {
							mapParams.pincolor = Titanium.Map.ANNOTATION_PURPLE;
							mapParams.rightButton = Titanium.UI.iPhone.SystemButton.DISCLOSURE;
						} else {
							
							mapParams.pinImage = "pin.png";
						}
						
						var annotation = Titanium.Map.createAnnotation(mapParams);				
					
						this.mapview.addAnnotation(annotation);
						//mapview.selectAnnotation(annotation);
						
					}
				
				} // endif null
	
			}	// enfor

			// el mapa tiene que ser global si no no funciona (??) y solo puede haber 1 por view (al menos en android)
			if (!mapIsAdded) {
				this.win.add(this.mapview);
				mapIsAdded = true;
			}
				
				
			activityIndicator.hide();				
			this.mapview.addEventListener('click', clickAnnotation);
				
		}	// en onload
	}
	
	
	////////////// private methods ////////////////

	var clickAnnotation = function(e) {
		//alert(e.clicksource);
		// abro la descripcion del cine
		if (!e) return;
		if (e.annotation && (e.clicksource === 'title' || e.clicksource == 'rightButton' || e.clicksource == 'subtitle') ) {  			
			// creo la windows de la descripcion
			winDescripcion = Titanium.UI.createWindow({
				url:"cine_descripcion.js",
				backgroundColor:'#fff',					
				title:e.annotation.title
			});
	
			winDescripcion.movieId = e.annotation.cineId;
			winDescripcion.titulo = e.annotation.title;
	
			this.tab.open(winDescripcion,{animated:true});
			
	        // para disparar el evento tiene que estar creada la ventana
			Ti.App.fireEvent('passValues', { movieId: e.annotation.cineId, titulo: e.annotation.title});
						
		}         
	}
	
	var cinesClickHandlers = function(e) {
	
		e.button1['tab'] = this.tab;
		e.button2['mapview'] = this.mapview;
		e.button2['loadData'] = this.loadData;
				
		
	};
	
	var onCreateCineMenu = function(e) {
				var menu = e.menu;			
				lstCines = menu.add({title : 'Listado'});
				var path = Titanium.Filesystem.resourcesDirectory;
				lstCines.setIcon('list.png');
				refreshCines = menu.add({title : 'Actualizar', mapview: mapview});
				refreshCines.setIcon('refresh.png');
				//refreshCines['mapview'] = this.mapview;
				Ti.API.info(this.mapview);	
				refreshCines['loadData'] = this.loadData
				//cinesClickHandlers({button1: lstCines, button2: refreshCines});
				
				lstCines.addEventListener('click', function() {
					var win = Titanium.UI.createWindow({
						title:'Listado de cines',	
						url:"cine_listado.js",			
						backgroundColor:'#fff'
					});
					
					tab.open(win,{animated:true});
					
			        // para disparar el evento tiene que estar creada la ventana
					Ti.App.fireEvent('passCinesValues', { lat: latitude, lon: longitude});
							
				});
		
				refreshCines.addEventListener('click', function(e) {
					e.source.mapview.removeAllAnnotations();
					e.source.mapview.removeEventListener('click', clickAnnotation);	
					e.source.loadData();
				});
				
	};
	
	function createCineMenuUI(tab, win) {
		if (osname == 'iphone' || osname=='ipad') {
			// ios nav button
			var listadoButton = Titanium.UI.createButtonBar({
				labels:['Listado'],
				backgroundColor:'#336699'
			});
			
			win.setRightNavButton(listadoButton);
			
			listadoButton.addEventListener('click', function(e) {
		
				var win = Titanium.UI.createWindow({
					url:"cine_listado.js",			
					backgroundColor:'#fff'
				});			
				
		        // para disparar el evento tiene que estar creada la ventana
				Ti.App.longitudeCine = longitude;
				Ti.App.latitudeCine = latitude;
				tab.open(win,{animated:true});			
			});
						
		} 	
		if (osname=='android') {		
			// creo menu contextual		
			var activity = win.activity;
			activity.onCreateOptionsMenu = onCreateCineMenu;
		}		
	}

