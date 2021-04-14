const authForm = document.getElementById('authForm')



module.exports = class authForm {
    constructor(socket) {
        this.socket = socket
    }

    formTemplate() {
        return `<div class="modal-overlay">
                    <div class="modal-window"> 
                        <div class="modal-window__content">
                            <h3 class="modal-title">Авторизация</h3>
                            <p class="modal-description">Введите пожалуйста своё ФИО и ник для дальшейшей авторизации</p>
                         </div>
                        <form class="modal-window__form form-auth" id="authForm">
                            <input class="form-auth__username" type="text" placeholder="Введите своё Имя и Фамилию">
                            <input class="form-auth__usernick" type="text" placeholder="Введите свой никнейм">
                            <button class="form-auth__submit" type="submit" id="authSubmit">Войти</button>
                        </form>
                    </div>
                </div>`
    }

    buildAuthModel() {
        this.modalAuth = document.createElement('div')
        this.modalAuth.classList.add('modal-auth')
        this.modalAuth.innerHTML= this.formTemplate()
        document.body.append(this.modalAuth)

        this.eventer()
    }

    eventer() {
        this.sendBtn = this.modalAuth.querySelector('#authSubmit')
        const userName = this.modalAuth.querySelector('.form-auth__username')
        const userNick = this.modalAuth.querySelector('.form-auth__usernick')
        this.authHandler = e => {
            e.preventDefault()
            const msgAuth = {
                type: "auth",
                userName: userName.value,
                userNick: userNick.value,
                date: new Date()
            };
            this.socket.send(JSON.stringify(msgAuth));
        }

        this.sendBtn.addEventListener('click', this.authHandler)
    }
    destroy() {
        this.sendBtn.removeEventListener('click', this.authHandler)
        document.body.removeChild(this.modalAuth)
    }
}