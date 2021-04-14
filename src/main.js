import './main.scss'
import ChatContent from './module/chatModul.js'
import UploadModalClass from './module/uploadAvatar.js'

const socket = new WebSocket("ws://localhost:8080");
const userProfile = document.querySelector('.chat-profile__user-name')
const authForm = document.getElementById('authForm')
const userName = authForm.querySelector('.form-auth__username')
const userNick = authForm.querySelector('.form-auth__usernick')
const sendBtn = authForm.querySelector('#authSubmit')
const modalAuth = document.querySelector('.modal-auth')
const chatTextArea = document.getElementById('textareaMsg')
const sendMsgChat = document.querySelector('.message-form__sendbtn')
const membersList = document.querySelector('.users-list')
const userProfileData = {}
const profileImg = document.querySelector('.chat-profile__photo')
const photoInput = document.getElementById('photoInput')
const fileReader = new FileReader()
const dialogBody = document.querySelector('.dialog')
const messagerChat = new ChatContent()
const uploadModal = new UploadModalClass()
let lastMsg;

document.body.addEventListener('drop', e => {
    e.preventDefault()
    e.stopPropagation()
    console.log('drop')
})

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

const addMember = (name, nick, dataImg = 'https://via.placeholder.com/120x120?text=No+Image') => {

    const addMemberLi = `<li class=\"users-list__item user-item\">\n` +
        ` <img src="${dataImg}" class=\"user-item__image\" data-userID="${name}${nick}"/>\n` +
        ` <div class=\"user-item__name\">${name} aka ${nick}</div>\n` +
        ` </li>`
    const listMember = document.createElement("template");
    listMember.innerHTML = addMemberLi
    membersList.append(listMember.content)
}


const sendMsg = () => {
    const msgChat = {
        type: "message",
        userName: userProfileData.userName,
        userNick: userProfileData.userNick,
        date: new Date(),
        text: chatTextArea.value
    };
    if (userProfileData.photoData) {
        msgChat.photoData = userProfileData.photoData
    }

    socket.send(JSON.stringify(msgChat));
    chatTextArea.value = "";
}


sendBtn.addEventListener('click', (e) => {
    e.preventDefault()
    authentication()
})

sendMsgChat.addEventListener('click', (e) => {
    e.preventDefault()
    sendMsg()
})



/*

*/
profileImg.addEventListener('click', e => {
    uploadModal.buildUploadModal()
})

socket.addEventListener('message', function (event) {
    const responseMsg = JSON.parse(event.data);
    if (responseMsg.type == "connect") {
        membersList.innerHTML = '';

        const memberObj = responseMsg.memberList;
        for (const key in memberObj) {

            addMember(memberObj[key].userName, memberObj[key].userNick, memberObj[key].photoData)
        }
    }
    if (responseMsg.type == "auth") {
        userProfileData.userName = responseMsg.userName;
        userProfileData.userNick = responseMsg.userNick;

        if (responseMsg.photoData) {
            profileImg.src = responseMsg.photoData
            userProfileData.photoData = responseMsg.photoData
        }
        modalAuth.classList.add('hide');
        userProfile.textContent = userProfileData.userName;
        return

    }
    if (responseMsg.type == "message") {
        if (!lastMsg || lastMsg != responseMsg.userName) {
            const myMsg = userProfileData.userName == responseMsg.userName
            dialogBody.append(messagerChat.buildMsg(responseMsg.text, myMsg, responseMsg.photoData))
            lastMsg = responseMsg.userName
        } else {
            messagerChat.addSecondMsg(responseMsg.text)
        }

    }
    if (responseMsg.type == "updateMember") {
        if (responseMsg.userName == userProfileData.userName && responseMsg.userNick == userProfileData.userNick) {
            userProfileData.photoData = responseMsg.photoData
        }
        const dataUser = membersList.querySelectorAll(`[data-userID]`)
        dataUser.forEach((elem) => {

            if (elem.dataset.userid == responseMsg.userName + responseMsg.userNick) {
                elem.src = responseMsg.photoData
            }
        })

    }
    // сделать на свичах
});




