module.exports = class ChatModal {
    constructor() {
        this.dialogBody = document.querySelector('.dialog')
    }

    createTemplate(text, myMsg, imgsrc= 'https://via.placeholder.com/120x120?text=No+Image',msgTime) {
        myMsg ? myMsg = "mymsg" : myMsg="";
        return `<li class="dialog__message ${myMsg}">
                    <img src="${imgsrc}" class="user-photo"/>
                    <ul class="textmsg-list">
                        <li class="textmsg-item">${text}<span>${msgTime}</span></li>
                    </ul>
                    </li>`
    }

    buildMsg(text, myMsg ,imgsrc= 'https://via.placeholder.com/120x120?text=No+Image',msgTime) {
        const templateElement = document.createElement("template");
        templateElement.innerHTML = this.createTemplate(text, myMsg,imgsrc,msgTime);
        return this.dialogBody.append(templateElement.content);

    }

    addSecondMsg(text, msgTime) {
        const lastMsg = document.querySelectorAll('.textmsg-item')
        const innerMsg = `${text}<span>${msgTime}</span>`
        const createLiMsg = document.createElement('li')
        createLiMsg.classList.add('textmsg-item')
        createLiMsg.innerHTML = innerMsg
        return lastMsg[lastMsg.length - 1].parentElement.append(createLiMsg)
    }
}