//A window object which will be associated with the stack of windows
exports.AppWindow = function(args) {
	var instance;
	// the generic controls for all the instances should be place here
	switch(args.kind) {
		case 'estrenos':
			ev = require('/ui/EstrenoView').EstrenoView; 
			instance = new ev({win: args.win, movies: args.movies}); 			
		break;
		
	}
	return instance;
};