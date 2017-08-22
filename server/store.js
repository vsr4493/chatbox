import redis from 'redis';
import {configAsync} from '../util/index';



const redisClient = (config) => {
	let creds = config;
	let client = redis.createClient(
		creds.port,
		creds.host
		//`redist://${creds.user}:${creds.password}@${creds.host}:${creds.port}`
	);
	/*Adding event listeners for client*/
	client.once('ready',function redisClientReady(){
		
		/*Flushing clientDB*/
		client.flushDB();
		console.log("Client is ready");

		client.get("CHAT_USERS",function(err,reply){
			if(reply) store.chatUsers = JSON.parse(reply);
		});

		client.get("CHAT_MESSAGES",function(err,reply){
			if(reply) store.chatMessages = JSON.parse(reply);
		});
	});
	
	client.on("connect",function redisClientConnected(){
		console.log("Client is connected");
	});

	return client; 
}

const Store = {
	state: {
		chatMessages: [],
		chatUsers: []
	},
	client: undefined
}

const StoreProto = {

	/*Setter for the store*/
	init: function(config){
		return (function(makeClient){ 
			this.client = makeClient(config);
		}).bind(this);
	},
	/*Getter for the store*/
	get: function(key,...args){
		return this.client.get.apply(key, ...args)
	},
	/*Setter for the store*/
	set: function(key,value, ...args){
		this[key] = value;
		return this.client.set.apply(key,value,...args);
	}
}

const makeStore = (makeClient) => (config) => {
	const storeClient = Object.assign(Object.create(StoreProto), Store);
	storeClient.init(config)(makeClient);
}

export {makeStore(redisClient)};