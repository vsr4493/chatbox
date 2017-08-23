import io from 'socket.io';
import Promise from 'bluebird';

const makeIOClient = ({httpClient, store}) => {
	const client = io(httpClient);
	client.on("connection", function(socket){
		let messages = store.getAsync("CHAT_USERS");
		let users = store.getAsync("CHAT_MESSAGES");
		Promise.all([messages,users]).then((res)=>{
			let [messages,users] = res;
			socket.emit("messages",messages);
			socket.emit("user_count_update", users.length+1);
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