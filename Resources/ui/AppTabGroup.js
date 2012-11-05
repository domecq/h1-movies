
var AppView = require('ui/AppView').AppView;

exports.AppTabGroup = function() {
	var instance = Ti.UI.createTabGroup();

	//loop through tab objects and add them to the tab group
	for (var i = 0, l = arguments.length; i < l; i++) {
		var tab = Ti.UI.createTab(arguments[i]);
		//on initialization, we track the current tab as the first one added
		instance.addTab(tab);
		if (i === 0) {
			instance.currentTab = tab;
		}
		
	}
	//track the current tab for the tab group
	instance.addEventListener('focus', function(e) {
		instance.currentTab = e.tab;
		// tipo de vista
		var kind = instance.currentTab.kind;
		// globals
		var movies = instance.currentTab.movies;		
		if (!instance.currentTab.loaded) {
			movies.ui.tabs.currentTab = instance.currentTab;
			movies.ui.appViews[kind] = new AppView({movies: movies, kind: kind , win: instance.currentTab.window });
			instance.currentTab.window.orientationModes=[Ti.UI.PORTRAIT];
			instance.currentTab.window.add(movies.ui.appViews[kind].buildView());
			instance.currentTab.loaded = true;
		}

	});
	return instance;
};