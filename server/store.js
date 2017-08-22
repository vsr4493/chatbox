import redis from 'redis';
import {configAsync} from '../util/index';
import Promise from 'bluebird';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const redisClient = (config) => {
	let creds = config;
	let client = redis.createClient(
		creds.port,
		creds.host
		//Alternate format
		//`redist://${creds.user}:${creds.password}@${creds.host}:${creds.port}` 
	);
	/*Adding event listeners for client*/
	client.once('ready',function redisClientReady(){
		console.log("Client is ready");
	});
	
	client.on("connect",function redisClientConnected(){
		console.log("Client is connected");
	});
	return client; 
}

export {redisClient as makeStore};