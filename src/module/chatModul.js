module.exports = class ChatModal {
    constructor() {
    }

    createTemplate(text, myMsg) {
        myMsg ? myMsg = "mymsg" : myMsg="";
        return `<li class="dialog__message ${myMsg} ">
                    <img class="user-photo"/>
                    <ul class="textmsg-list">
                        <li class="textmsg-item">${text}</li>
                    </ul>
                    </li>`
    }

    buildMsg(text, myMsg) {
        const templateElement = document.createElement("template");
        templateElement.innerHTML = this.createTemplate(text, myMsg);
        return templateElement.content;
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