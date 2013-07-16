exports.AppView = function(args) {
	var instance;
	// the generic controls for all the instances should be place here
	switch(args.kind) {
		case 'estrenos':
			instance = require('/ui/EstrenoView'); 
			instance.init({win_params: args.win, movies: args.movies, win: args.win }); 			
		break;
		case 'cartelera':
			instance = require('/ui/CarteleraView'); 
			instance.init({win_params: args.win, movies: args.movies, win: args.win }); 			
		break;
		case 'cines':
			instance = require('/ui/CineView'); 
			instance.init({win_params: args.win, movies: args.movies, win: args.win }); 			
		break;		
		
	}
	return instance;
};