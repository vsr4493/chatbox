const errorHandler = (res) => (err) => {
	console.log(`ERROR: ${err}`);
	res.send({
		"status": "FAILED"
	})
};

function makeUserController(store){
	return {
		joinPOST(req,res){
			let username = req.body.username;
			store.getAsync("CHAT_USERS").then((usersJSON) => 
			{
				let users = JSON.parse(usersJSON) || [];
				if(users.indexOf(username)==-1){
					users.push(username);
					store.set("CHAT_USERS", JSON.stringify(users));
					res.send({
						'users': users,
						'status': "OK"
					});
				}else throw new Error("Username is already in use");
			}).catch(errorHandler(res)); 
		},
		leavePOST(req,res){
			let username = req.body.username;
			store.getAsync("CHAT_USERS").then(users => 
			{
				let updatedUsers = users.filter(user => user !== username);
		    client.set('CHAT_USERS', JSON.stringify(updatedUsers));
		    res.send({
		        'status': 'OK'
		    });
			}).catch(errorHandler(res));
		},
		usersGET(req,res){
			store.getAsync("CHAT_USERS").then(users => 
			{
				res.send(users);
			});
		}
	};
}

export default makeUserController;