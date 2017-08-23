(function(){
	/*Display*/
	var $joinChat =  $("#chat_join_display");
	var $chatBox = $("#chat_messages_display");
	var $chatMessages = $("#chat_messages");
	var $chatInfo = $("#chat_info_display");
	/*Input*/
	var $username = $("#username");
	var $message = $("#message");
	/*Buttons*/
	var $joinChatBtn = $("#chat_join_btn");
	var $leaveChatBtn = $("#chat_leave_btn");
	var $sendMessageBtn = $("#message_send_btn");
	
	/*Socket client*/
	var socket = io();
	
	/*Initial States*/
	$chatBox.hide();
	$joinChat.show();
	
	/*Get User Count and show it by default*/
	getUserCount(showUserCount($chatInfo));

	$joinChatBtn.on("click",
		joinChat($chatBox, $joinChat, $username)
	);
	$leaveChatBtn.on("click", 
		leaveChat($chatBox,$joinChat, $username)
	);
	$sendMessageBtn.on("click", 
		sendMessage($username, $message)
	);

	addSocketListeners(socket,{
		showMessages: showMessages($chatMessages),
		showUserCount: showUserCount($chatInfo)
	});

})();

/*UI Updates*/

function showUserCount(display){
	return function(count){
		display.text(count + " people are using the chat room.");
	}
}

function showMessages(display){
	// Array[Object{sender, message}] => DOM
	return function(messages){
		if(messages.length>0){
			var $messages = messages.map(function(message){
				var outer = $("<div class='message'></div>");
				var sender = $("<label class='sender text-info'></label>").text(message.sender+" : ");
				var msg = $("<span class='content small'></span>").text(message.message);
				return outer.append([sender,msg]);
			});
			display.empty();
			display.append($messages);
		} 
	}
}

/*API Calls*/
function joinChat($chatBox, $joinChat, $username){
	return function(evt){
		var username = $username.val().trim();
		$.ajax({
			url: "api/user_join",
			type:"POST",
			data: {
				username:username
			},
			success:function(res){
				if(res.status === "OK"){
					$chatBox.show();
					$joinChat.hide();
				}else{
					alert("Username is already taken. Please use another.");		
				}
			}
		})
	};
}

function leaveChat($chatBox, $joinChat, $username){
	return function(evt){
		var username = $username.val().trim();
		$.ajax({
			url: "api/user_leave",
			type:"POST",
			data: {
				username:username
			},
			success:function(res){
				if(res.status === "OK"){
					$chatBox.hide();
					$joinChat.show();
				}
			}
		});
	};
}

function getUserCount(renderer){
	$.get("api/user_all",function(res){
		var count = (res && JSON.parse(res).length) || 0;
		renderer(count);
	});
}

function sendMessage($username, $message){
	return function(evt){
		var username = $username.val().trim();
		var message = $message.val().trim();
		$.ajax({
			url: "api/message_add",
			type:"POST",
			data: {
				username:username,
				message:message
			},
			success:function(res){
				if(res.status === "OK"){
					$message.val("");
				}
			}
		})
	}
}

function addSocketListeners(socket, actions){
	socket.on('user_count_update', function(data) {
		actions.showUserCount(data);
	});
	socket.on('messages',function(messages){
		console.log(messages);
		var messages = messages || [];
		actions.showMessages(messages);
	});
}
