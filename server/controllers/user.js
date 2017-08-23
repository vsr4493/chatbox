import events from 'events';

const errorHandler = (res) => (err) => {
	console.log(`ERROR: ${err}`);
	res.send({
		"status": "FAILED"
	})
};

const parseUsers = (usersJSON) => {
	return JSON.parse(usersJSON) || [];
}

function user({store,socketAPI}){
	return {
		join(req,res){
			let username = req.body.username;
			store.getAsync("CHAT_USERS").then((usersJSON) => 
			{
				let users = parseUsers(usersJSON);
				if(users.indexOf(username)==-1){
					users.push(username);
					store.set("CHAT_USERS", JSON.stringify(users));

					/*Emitting updated user count to all users*/
					socketAPI && socketAPI.updateUserCount(users.length);

					res.send({
						'users': users,
						'status': "OK"
					});
				}else throw new Error("Username is already in use");
			}).catch(errorHandler(res)); 
		},
		leave(req,res){
			let username = req.body.username;
			store.getAsync("CHAT_USERS").then(usersJSON => 
			{
				let users = parseUsers(usersJSON);
				let updatedUsers = users.filter(user => user !== username);
		    store.set('CHAT_USERS', JSON.stringify(updatedUsers));

		    /*Emitting updated user count to all users*/
		    socketAPI && socketAPI.updateUserCount(updatedUsers.length);

		    res.send({
		        'status': 'OK'
		    });
			}).catch(errorHandler(res));
		},
		all(req,res){
			store.getAsync("CHAT_USERS").then(users => 
			{
				res.send(users);
			});
		}
	};
}

export default user;