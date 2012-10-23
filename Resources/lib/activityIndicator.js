var activityIndicator = Titanium.UI.createActivityIndicator({
	bottom: 10, 
	height: 50,
	width: 'auto' 
    
});

if (Titanium.Platform.name == 'iPhone OS') 
	activityIndicator.style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG; 