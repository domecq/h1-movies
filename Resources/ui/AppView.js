exports.AppView = function(args) {
	var instance;
	// the generic controls for all the instances should be place here
	switch(args.kind) {
		case 'estrenos':
			EstrenoView = require('/ui/EstrenoView'); 
			instance = new EstrenoView({win_params: args.win, movies: args.movies, win: args.win }); 			
		break;
		case 'cartelera':
			CarteleraView = require('/ui/CarteleraView'); 
			instance = new CarteleraView({win_params: args.win, movies: args.movies, win: args.win }); 			
		break;
		
	}
	return instance;
};