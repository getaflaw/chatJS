import './main.scss'
import ChatContent from './module/chatModul'
import UploadModalClass from './module/uploadAvatar'
import AuthFormModal from './module/auth'
import ChatMembers from './module/chatMembers'


const socket = new WebSocket("ws://localhost:8080");
const userProfile = document.querySelector('.chat-profile__user-name')
const sendMsgChat = document.querySelector('.message-form__sendbtn')
const userProfileData = {}
const profileImg = document.querySelector('.chat-profile__photo')
const messagerChat = new ChatContent(socket,userProfileData)
const uploadModal = new UploadModalClass()
const modalFormAuth = new AuthFormModal(socket)
const chatList = new ChatMembers(socket)
let lastMsg;

document.addEventListener('DOMContentLoaded', ()=> {
    modalFormAuth.buildAuthModel()
})

sendMsgChat.addEventListener('click', (e) => {
    e.preventDefault()
    messagerChat.sendMsg()
})


profileImg.addEventListener('click', e => {
    uploadModal.buildUploadModal(socket, userProfileData.userName, userProfileData.userNick)
})


socket.addEventListener('message', function (event) {
    const responseMsg = JSON.parse(event.data);
    switch (responseMsg.type) {
        case 'connect':
            chatList.addMember(responseMsg)
            break

        case 'auth':
            console.log(responseMsg)
            userProfileData.userName = responseMsg.userName;
            userProfileData.userNick = responseMsg.userNick;

            if (responseMsg.photoData) {
                profileImg.src = responseMsg.photoData
                userProfileData.photoData = responseMsg.photoData
            }
            chatList.getAllMembers(responseMsg.membersList)
            modalFormAuth.destroy()
            userProfile.textContent = userProfileData.userName;
            break

        case 'message':
            if (!lastMsg || lastMsg !== responseMsg.userName) {
                const myMsg = userProfileData.userName === responseMsg.userName
                messagerChat.buildMsg(responseMsg.text, myMsg, responseMsg.photoData, responseMsg.date)
                lastMsg = responseMsg.userName
            } else {
                messagerChat.addSecondMsg(responseMsg.text, responseMsg.date)
            }
            break

        case 'updateMember':
            chatList.updateAvatar(responseMsg)
            break
        case 'disconnect':
            console.log(responseMsg)
            chatList.removeMember(responseMsg)
    }

})





