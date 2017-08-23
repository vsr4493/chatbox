import http from 'http';
import {configAsync} from './util/index';
import {makeServer,makeStore,makeIOClient} from './server/index';
import events from 'events';

/*Setting up server with the recieved configuration*/
const serverSetup = (config) => {
	//Initializing In-memory store
	const port = process.env.PORT || config.app.port || 8080;
	const store = makeStore(config);
	const serverClient = makeServer({
		store:store
	});

	/*Creating an http server instance*/
	// -Why do we need an http.Server if we have express.listen()?
	// --Because express.listen() will start accepting connections and we want to hook in socketIO before that.
	// http.Server() expects a method with a signature func(req,res) to handle the connection.
	
	const httpClient = http.Server(serverClient.app);
	/*Creating a socketIO server instance with the existing http server*/
	const ioClient = makeIOClient({
		store: store,
		httpClient:httpClient
	});
	
	app.setIOClient(ioClient);


	httpClient.listen(port, function startHttpClient(){
		console.log(`Server started. Listening on : ${port}`);
	});
};

/*Retreive app configuration and start the server*/
const startServer = function(){
	configAsync.then((config)=>{
		serverSetup(config);
	}).catch((err) => {
		console.log(err);
		console.log("Could not access configuration");
	});
}

startServer();