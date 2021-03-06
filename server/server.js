import express from 'express';
import bodyParser from 'body-parser';
import log from 'npmlog';
import path from 'path';
import userControllerFactory from './controllers/user';
import messageControllerFactory from './controllers/message';
import {ioClient} from '../index';

const makeServer = (store) => {
	/*Creating an express instance*/
	//express() returns a function with a signature func(req,res) which can handle requests and response arguments.
	const app = express();
	app.use(express.static('public'));

	app.get('/', function (req, res) {
	    res.sendFile('views/index.html', {
	        root: path.dirname(require.main.filename)
	    });
	});

	const api = express.Router();
	ioClient.then((client) => {
		const userController = userControllerFactory({
			store:store,
			socketAPI:client
		});
		const messageController = messageControllerFactory({
			store:store,
			socketAPI:client
		});

		/*Using bodyparser middleware to add payload data to request object as property*/
		api.use(bodyParser.urlencoded({
			extended:true,
			type: "application/x-www-form-urlencoded"
		}));
		
		/*User Route Handlers*/
		api.post('/user_join', userController.join);
		api.post('/user_leave', userController.leave);
		api.get('/user_all', userController.all);
		
		/*Message Route Handlers*/
		api.get('/message_all', messageController.getMessage);	
		api.post('/message_add', messageController.addMessage);	

		app.use("/api",api);
	}); 
	return app;	
}

export {makeServer};