import http from 'http';
import {configAsync} from './util/index';
import {makeServer,makeStore,makeIOClient} from './server/index';
import events from 'events';

/*Setting up server with the recieved configuration*/
const serverSetup = (config) => {
	//Initializing In-memory store
	const port = process.env.PORT || config.app.port || 8080;
	const store = makeStore(config);
	const app = makeServer(store);
	/*Creating an http server instance*/
	// -Why do we need an http.Server if we have express.listen()?
	// --Because express.listen() will start accepting connections and we want to hook in socketIO before that.
	// http.Server() expects a method with a signature func(req,res) to handle the connection.
	
	const httpClient = http.Server(app);
	/*Creating a socketIO server instance with the existing http server*/
	const ioClient = makeIOClient({
		store: store,
		httpClient:httpClient
	});

	httpClient.listen(port, function startHttpClient(){
		console.log(`Server started. Listening on : ${port}`);
	});
	return Promise.resolve(ioClient);
};

/*Retreive configuration and start the server*/
const startServer = function(){
	return configAsync.then((config)=>{
		return serverSetup(config);
	}).catch((err) => {
		console.log(err);
		return Promise.resolve(null);
	});
}

/*Export a promise which will resolve as the websocket client*/
const ioClient = startServer();

export {ioClient};