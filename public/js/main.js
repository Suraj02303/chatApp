//front end javascript
const chatForm = document.getElementById('chat-form');   //this is where we provide input text message
const UserLeft = document.querySelector('user-left');   //this is where we provide input text message
const chatMessages = document.querySelector('.chat-messages');  //this is where we display our output message
const roomName = document.getElementById('room-name'); // this is where we put the roomname
const userList = document.getElementById('users'); // this is where we store users name

//Get Username and room from URL //13
// this will search the url string and get the required value.
// the current url will be chat.html#XYZ#ABC like something 
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

const socket = io();

//join chatroom//14
socket.emit('joinRoom',{username, room});

//Get room and users // 15
socket.on('roomUsers',({room, users})=>{
  outputRoomName(room);
  outputUsers(users);
});

// showing message emitted by sever.js on front end  // 2
socket.on('message', message=>{
  console.log(message);
  outputMessage(message);// 7

  //Scroll down //11
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message Submit //4
chatForm.addEventListener('submit' ,(e)=>{
  e.preventDefault();

  //Get Message Text
  //here we are access the input with msg id of input method
  const msg = e.target.elements.msg.value; //5

  //console.log(msg);

  //Emit message to server //6
  
  socket.emit('chatMessage', msg);
  // Clear Input //12
  e.target.elements.msg.value ='';
  // after clearing input remain on the same positon,
  e.target.elements.msg.focus();
})

//
UserLeft.addEventListener('submit', ()=>{
  socket.emit('disconnect');
})

//Output Message to DOM //12
function outputMessage(message){
  const div= document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username}  <span>${message.time}</span></p>
            <p class="text">
            ${message.text}
            </p>`;
  //here we select the chat-messages
  document.querySelector('.chat-messages').appendChild(div); // 9
}

//Add room name to DOM
function outputRoomName(room){
  roomName.innerText = room;
}

//Add users name to DOM
function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user =>`
    <li>
    ${user.username}
    </li>
    `).join('')
}`;
}
