(function() {	
	// -------
	// ------- here, you should add all those graphic elements that will be use in the different views throughout the application
	// -------

	movies.ui = {};
		
	/**
	 *  Activity indicator
	 */
	movies.ui.activityIndicator = Titanium.UI.createActivityIndicator({
		bottom: 10, 
		height: 50,
		width: 'auto' 
	    
	});
	
	if (movies.osname == 'iphone') 
		movies.ui.activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG; 	

	/**
	 * createRow: Create a table row
	 */	
	movies.ui.createRow = function(imagen, pelicula_id, titulo) {
		
		// creo la row
		var path = Titanium.Filesystem.resourcesDirectory;
		var row = Ti.UI.createTableViewRow({hasChild:true,movieId: pelicula_id, titulo: titulo });
		row.backgroundSelectedColor = '#fff';
		row.height = movies.rh;
		row.className = 'datarow';
		row.clickName = 'row';
		row.rightImage = '../images/right_arrow.png';
		
		var photoScale = Titanium.UI.createImageView({ 
			image: imagen,
			left: 0,
			width: movies.ancho,
			height: movies.ancho,
			clickName:'photo'
		});
		
		var crop = Titanium.UI.createView({
			top:0,
			width: movies.ancho,
			height: 75
		});
								
		crop.add(photoScale);
		var croppedImage = crop.toImage();			
					
		var imageView = Titanium.UI.createImageView({
			top: 0,
		    image:croppedImage,
		    width: movies.ancho, height: 75
		});
		row.add(imageView);
	
		var maskView = Titanium.UI.createView({				
			top:0,
			width: movies.ancho,
			height: 75,
			backgroundColor: '#000000',
			opacity: 0.45
		});
		
		row.add(maskView);
		return row;
	
	}
	
	/**
	 *  create main application window
	 */ 
	movies.ui.createApplicationWindow = function () {
		
		// commonJS modules
		var AppTabGroup = require('ui/AppTabGroup').AppTabGroup;						
			
		// Global tab group
		movies.ui.tabs = {};
		movies.ui.appViews = [];	
		movies.ui.tabs = new AppTabGroup(
			{
			    icon:'images/estrenos.png',
			   	title:'Estrenos',
			   	height: 30, 
			   	width: 30,
			   	window: Ti.UI.createWindow({ title:'Estrenos', backgroundColor:'#fff' }),
			   	loaded: false,
			   	kind: 'estrenos',
			   	movies: movies    
			},
			{
			    icon:'images/cartelera.png',
			   	title:'Cartelera',
			   	height: 30, 
			   	width: 30,
			   	window: Ti.UI.createWindow({ title:'Cartelera', backgroundColor:'#fff' }),
			   	loaded: false,
			   	kind: 'cartelera',
			   	movies: movies		   	 
			}

		);
		movies.ui.tabs.open();
	}
	
	
})();