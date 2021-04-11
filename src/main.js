import './main.scss'
import ChatContent from './module/chatModul.js'

const socket = new WebSocket("ws://localhost:8080");

const authForm = document.getElementById('authForm')
const userName = authForm.querySelector('.form-auth__username')
const userNick = authForm.querySelector('.form-auth__usernick')
const sendBtn = authForm.querySelector('#authSubmit')
const modalAuth = document.querySelector('.modal-auth')
const chatTextArea = document.getElementById('textareaMsg')
const sendMsgChat = document.querySelector('.message-form__sendbtn')
const membersList = document.querySelector('.users-list')
const userProfile = {}
const dialogBody = document.querySelector('.dialog')
const messagerChat = new ChatContent()
let lastMsg;

const authentication = () => {
    // Construct a msg object containing the data the server needs to process the message from the chat client.
    const msgAuth = {
        type: "auth",
        userName: userName.value,
        userNick: userNick.value,
        date: new Date()
    };

    // Send the msg object as a JSON-formatted string.
    socket.send(JSON.stringify(msgAuth));

    // Blank the text input element, ready to receive the next line of text from the user.
    userName.value = ""
    userNick.value = ""
}

const addMember = (name, nick) => {

    const addMemberLi = `<li class=\"users-list__item user-item\">\n` +
        ` <img class=\"user-item__image\"/>\n` +
        ` <div class=\"user-item__name\">${name} aka ${nick}</div>\n` +
        ` </li>`
    const listMember = document.createElement("template");
    listMember.innerHTML = addMemberLi
    membersList.append(listMember.content)
}


const sendMsg = () => {
    const msgChat = {
        type: "message",
        userName: userProfile.userName,
        userNick: userProfile.userNick,
        date: new Date(),
        text: chatTextArea.value
    };
    socket.send(JSON.stringify(msgChat));
    chatTextArea.value = "";
}

const typeOfMsg = (myMsg, reapeat) => {
    if (reapeat == true) {
        messagerChat.addSecondMsg('Dyrak');
    }
}

sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    authentication()
})

sendMsgChat.addEventListener('click', (e) => {
    e.preventDefault()
    sendMsg()

})


socket.addEventListener('message', function (event) {
    const responseMsg = JSON.parse(event.data);
    if (responseMsg.type == "connect") {
        membersList.innerHTML = '';
        const memberObj = responseMsg.memberList;
        for (const key in memberObj) {
            addMember(memberObj[key].userName, memberObj[key].userNick)
        }
    }
    if (responseMsg.type == "auth") {
        if (userProfile != {}) {
            userProfile.userName = responseMsg.userName;
            userProfile.userNick = responseMsg.userNick;
            modalAuth.classList.add('hide');
            //addMember(responseMsg.userName, responseMsg.userNick);
            return
        }
        addMember(responseMsg.userName, responseMsg.userNick);
    }
    if (responseMsg.type == "message") {
        console.log(userProfile.userName)
        console.log(responseMsg.userName)
        if (!lastMsg || lastMsg != responseMsg.userName) {
            dialogBody.append(messagerChat.buildMsg(responseMsg.text, userProfile.userName==responseMsg.userName))
            lastMsg = responseMsg.userName
        } else {
            messagerChat.addSecondMsg(responseMsg.text)
        }

    }
    // сделать на свичах
});




