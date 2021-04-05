const socket = new WebSocket("ws://localhost:8080");
const btn = document.querySelector('#btn');

socket.addEventListener('message', function (event) {

});

socket.addEventListener('error', function() {
    alert('Соединение закрыто или не может быть открыто');
});

let msgData = "123";
function sendMessage() {
    socket.send(msgData);
    msgData="";
}
btn.addEventListener('click', sendMessage);
