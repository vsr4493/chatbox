import express from 'express';
import bodyParser from 'body-parser';
import log from 'npmlog';
import path from 'path';
import makeUserController from './controllers/user';

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

	const userController = makeUserController(store);
	app.get('/', function (req, res) {
			console.log(__dirname);
	    res.sendFile('views/index.html', {
	        root: path.dirname(require.main.filename)
	    });
	});
	app.post('/join', userController.joinPOST);
	app.post('/leave', userController.leavePOST);
	app.get('/users', userController.usersGET);
	/*Adding express middleware for serving static files*/
	return app;	
}

export {makeServer};