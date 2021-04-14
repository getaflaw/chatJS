module.exports = class ChatModal {
    constructor() {
    }

    createTemplate(text, myMsg, imgsrc= 'https://via.placeholder.com/120x120?text=No+Image') {
        myMsg ? myMsg = "mymsg" : myMsg="";
        console.log(imgsrc)
        return `<li class="dialog__message ${myMsg}">
                    <img src="${imgsrc}" class="user-photo"/>
                    <ul class="textmsg-list">
                        <li class="textmsg-item">${text}</li>
                    </ul>
                    </li>`
    }

    buildMsg(text, myMsg ,imgsrc= 'https://via.placeholder.com/120x120?text=No+Image') {
        const templateElement = document.createElement("template");
        templateElement.innerHTML = this.createTemplate(text, myMsg,imgsrc);
        return document.body.append(templateElement.content);
    }

    addSecondMsg(text) {
        const lastMsg = document.querySelectorAll('.textmsg-item')
        const createLiMsg = document.createElement('li')
        createLiMsg.classList.add('textmsg-item')
        createLiMsg.textContent = text
        console.log(createLiMsg)
        return lastMsg[lastMsg.length - 1].parentElement.append(createLiMsg)
    }
}