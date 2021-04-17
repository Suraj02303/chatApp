const express = require('express'); //1
const http = require('http');// 7
const path = require('path'); //5 
const socketio = require('socket.io'); //10
const formatMessage = require('./utils/messages') //17
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users') //24
const app = express(); // 2

const server = http.createServer(app); //8
const io = socketio(server); //11

const botName = 'ChatCord Bot'; //18
//Set static Folder
app.use(express.static(path.join(__dirname, 'public'))); //6 , using path module to join
const PORT = 3000 || process.env.PORT;  //3

//Run when a client connects //23

//start of connection
io.on('connection' , socket =>{
	
	//start of joinRoom
	socket.on('joinRoom', ({username ,room})=>{

		const user = userJoin(socket.id, username ,room); //25 // will return user
		
		socket.join(user.room);
	
		//welcome current user
		socket.emit('message' ,formatMessage(botName, 'Welcome to CharCord')); //19
    
		//Broadcast when a user connects to specific room //26
		socket.broadcast.to(user.room).emit('message' , 
		formatMessage(botName, `${user.username} has joined the chat`)
		);
		//Send users and room info //28
		io.to(user.room).emit('roomUsers', {
			room:user.room,
			users: getRoomUsers(user.room)
		});
	});
	//end of joinRoom

	//Listen for the chatMessage //16
	//Start of chatMessage
	socket.on('chatMessage',msg =>{
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit('message' ,formatMessage(user.username, msg));//27
	});
	//Runs when a client Disconnects //1
	//start of disconnect method
	socket.on('disconnect', () => {
	    	const user = userLeave(socket.id); //27
	    	if(user){ //27
	    		io.to(user.room).emit(
	    		'message' ,
	    		formatMessage(botName, `${user.username} has left the chat`)
	    		); //21

	    		//Send users and room info //28
	    		io.to(user.room).emit('roomUsers', {
				room:user.room,
				users: getRoomUsers(user.room)
				});
	    	}
	});
	//end of disconnect method
//end of chatMessage
});
//end of connection
server.listen(PORT , () => console.log(`Server running on port ${PORT}`)); // 9

	