import http from 'http';
import io from 'socket.io';
import redis from 'redis';
import fs from 'fs';
import * as conf from './conf/index';
import {app} from './server/index';

/*Creating an http server instance*/
// -Why do we need an http.Server if we have express.listen()?
// --Because express.listen() will start accepting connections and we want to hook in socketIO before that.
// http.Server() expects a method with a signature func(req,res) to handle the connection.
const httpClient = http.Server(app);

/*Creating a socketIO server instance with the existing http server*/
const ioClient = io(httpClient);


/*Starting the server*/
const startServer = () => {
	let port = process.env.PORT || conf.app.port || 8080;
	httpClient.listen(port, function startHttpClient(){
		console.log(`Server started. Listening on : ${port}`);
	});
}

var people = [];
var messages = [];
