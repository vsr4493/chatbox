import redis from 'redis';
import {configAsync} from '../util/index';

const redisClient = (config) => {
	let creds = config;
	let client = redis.createClient(
		`redist://${creds.user}:${creds.password}@${creds.host}:${creds.port}`
	);
	/*Adding event listeners for client*/
	client.once('ready',function redisClientReady(){
		
		/*Flushing clientDB*/
		client.flushDB();
		
		client.get("CHAT_USER",function(err,reply){
			if(reply){
				//TODO
			}
		});
	}); 
	return client; 
}


export {redisClient};