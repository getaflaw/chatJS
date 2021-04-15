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

    validateAuth(name, nick) {
        const validateError = (input, textError, defaultText) => {
            input.placeholder = textError
            input.classList.add('validate-error')
            setTimeout(() => {
                input.placeholder = defaultText
                input.classList.remove('validate-error')
            }, 1500)
        }
        if (!name.value?.trim() || !nick.value?.trim()) {
            if (!name.value?.trim()) {
                validateError(name, 'Заполните поле Имени', 'Введите своё Имя и Фамилию')
            }
            if (!nick.value?.trim()) {
                validateError(nick, 'Заполните поле Никнейма', 'Введите свой никнейм')

            }
            return false
        }
        if (name.value.trim().length > 16 || name.value.trim().length < 4 || nick.value.trim().length > 10 || nick.value.trim().length < 4) {
            if (name.value.trim().length > 16 || name.value.trim().length < 4) {
                validateError(name, 'Введите от 4 до 16 символов', 'Введите своё Имя и Фамилию')
            }
            if (nick.value.trim().length > 10 || nick.value.trim().length < 4) {
                validateError(nick, 'Введите от 4 до 10 символов', 'Введите свой никнейм')
            }
            return false
        }

        return true
    }

    buildAuthModel() {
        this.modalAuth = document.createElement('div')
        this.modalAuth.classList.add('modal-auth')
        this.modalAuth.innerHTML = this.formTemplate()
        document.body.append(this.modalAuth)

        this.eventer()
    }

    eventer() {
        this.sendBtn = this.modalAuth.querySelector('#authSubmit')
        this.userName = this.modalAuth.querySelector('.form-auth__username')
        this.userNick = this.modalAuth.querySelector('.form-auth__usernick')
        this.authHandler = e => {
            e.preventDefault()
            if (this.validateAuth(this.userName, this.userNick)) {
                const msgAuth = {
                    type: "auth",
                    userName: this.userName.value,
                    userNick: this.userNick.value,
                    date: new Date()
                };
                this.socket.send(JSON.stringify(msgAuth));
            }
        }

        this.sendBtn.addEventListener('click', this.authHandler)
    }

    destroy() {
        this.sendBtn.removeEventListener('click', this.authHandler)
        document.body.removeChild(this.modalAuth)
    }
}