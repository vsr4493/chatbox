import io from 'socket.io';
import Promise from 'bluebird';

const makeIOClient = ({httpClient, store}) => {
	const client = io(httpClient);
	client.on("connection", function(socket){
		console.log("Connection attempted");
		let users = store.getAsync("CHAT_USERS");
		let messages = store.getAsync("CHAT_MESSAGES");
		Promise.all([messages,users]).then((res)=>{
			let [messages,users] = res;
			let messagesParsed = (messages && JSON.parse(messages)) || [];
			socket.emit("messages",messagesParsed);
			let usersCount = (JSON.parse(users) || []).length;
			socket.emit("user_count_update", usersCount);
		});
	});
	const api = {
		updateUserCount(count){
			client.sockets.emit("user_count_update",count)	
		},
		updateMessages(messages){
			client.sockets.emit("messages",messages);
		}
	}
	return api;
}

export {makeIOClient};