
const errorHandler = (res) => (err) => {
	console.log(`ERROR: ${err}`);
	res.send({
		"status": "FAILED"
	})
};

const parseMessages = (messagesJSON) => {
	return JSON.parse(messagesJSON) || [];
}

function message({store,socketAPI}){
	return {
		addMessage(req,res){
			let username = req.body.username;
			let message = req.body.message;
			store.getAsync("CHAT_MESSAGES").then((messagesJSON) => 
			{
				let messages = parseMessages(messagesJSON);
				messages.push({
					'sender': username,
					'message': message
				});
				store.set("CHAT_MESSAGES", JSON.stringify(messages));

				/*Emitting updated messages to all users*/
				socketAPI && socketAPI.updateMessages(messages);

				res.send({
					'status': "OK"
				});
			}).catch(errorHandler(res)); 
		},
		getMessage(req,res){
			store.getAsync("CHAT_MESSAGES").then((messagesJSON) => 
			{
				res.send(messagesJSON);
			}).catch(errorHandler(res));
		}
	};
}

export default message;