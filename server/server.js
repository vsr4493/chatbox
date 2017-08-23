import express from 'express';
import bodyParser from 'body-parser';
import log from 'npmlog';
import path from 'path';
import user as userControllerFactory from './controllers/user';
import message as messageControllerFactory from './controllers/message';

/*Logging*/
log.enableColor();
const logSilly = (message) => log.silly("Express: ", message);
log.level = "silly";
logSilly("Hey there");


const makeServer = (store) => {
	/*Creating an express instance*/
	//express() returns a function with a signature func(req,res) which can handle requests and response arguments.
	const app = express();
	app.use(express.static('public'));
	app.use(bodyParser.urlencoded({
		extended:true,
		type: "application/x-www-form-urlencoded"
	}));

	const userController = userControllerFactory(store);
	const messageController = messageControllerFactory(store);

	app.get('/', function (req, res) {
			console.log(__dirname);
	    res.sendFile('views/index.html', {
	        root: path.dirname(require.main.filename)
	    });
	});
	
	/*User Route Handlers*/
	app.post('/join', userController.join);
	app.post('/leave', userController.leave);
	app.get('/users', userController.all);
	/*Message Route Handlers*/
	app.get('/message', messageController.getMessage);	
	app.post('/message', messageController.addMessage);	

	return app;	
}

export {makeServer};