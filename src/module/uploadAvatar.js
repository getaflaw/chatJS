module.exports = class LoadAvatarModal {
    constructor() {    }

    templateModal() {
        return '<div class="modal-upload">\n' +
            '        <div class="upload-window">\n' +
            '            <label for="photoInput" class="upload-window__photo-area" id="dropImageZone">\n' +
            '            <input type="file" id="photoInput">\n' +
            '                <div  ></div>\n' +
            '            </label>\n' +
            '            <p class="upload-window__description">Область для профильной фотографии</p>\n' +
            '            <div class="upload-window__btn upload-btn">\n' +
            '                <button class="upload-btn__cancel">Отмена</button>\n' +
            '                <button class="upload-btn__upload">Загрузить</button>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>'
    }

    buildUploadModal(socket,dataProfile) {
        this.socket = socket
        this.userName = dataProfile.userName
        this.userNick = dataProfile.userNick
        const templateUploadModal = document.createElement("template");
        templateUploadModal.innerHTML = this.templateModal();
        document.body.append(templateUploadModal.content)
        this.modal = document.querySelector('.modal-upload')
        this.listenerBtn()
        this.dropPhotoEvent()
    }

    dropPhotoEvent() {
        this.fileReader = new FileReader()
        this.dropArea = document.getElementById('dropImageZone')

        this.dragActive = event => {
            event.preventDefault()
            event.stopPropagation()
            this.dropArea.classList.add('has-upload')
        }
        this.dragDisable = event => {
            event.preventDefault()
            event.stopPropagation()
            this.dropArea.classList.remove('has-upload')
        }
        this.droped = event => {
            this.dragDisable(event)
            this.dropArea.style.border = 'none';
            this.dropArea.classList.add('already-upload')
            const avatarFile = event.dataTransfer.files[0]
            if (avatarFile.size > 300 * 1024) {
                alert('Слишком большой файл');
            } else {
                this.fileReader.readAsDataURL(avatarFile);
            }
        }
        this.choosedFile = event => {
            const avatarFile = event.target.files[0];
            this.dropArea.classList.add('already-upload')
            if (avatarFile) {
                if (avatarFile.size > 300 * 1024) {
                    alert('Слишком большой файл');
                } else {
                    this.fileReader.readAsDataURL(avatarFile);
                }
            }
        }
        this.fileReaderLoad = () => {
            this.dropArea.style.backgroundImage = `url("${this.fileReader.result}")`
            this.dataPhoto = this.fileReader.result
        }
        this.dropArea.addEventListener('dragenter', this.dragActive)
        this.dropArea.addEventListener('dragover', this.dragActive)
        this.dropArea.addEventListener('dragleave', this.dragDisable)
        this.dropArea.addEventListener('drop', this.droped)
        this.dropArea.addEventListener('change', this.choosedFile)
        this.fileReader.addEventListener('load', this.fileReaderLoad)

        // avatarImg.src = fileReader.result;


    }

    listenerBtn() {
        this.cancelBtn = this.modal.querySelector('.upload-btn__cancel')
        this.uploadBtn = this.modal.querySelector('.upload-btn__upload')
        this.avatarImg = document.getElementById('avatarPhoto')

        this.cancelHandler = () => this.destroy()
        this.uploadHandler = () => {
            if (this.dataPhoto) {
                this.avatarImg.src = this.dataPhoto
                const uploadPhoto = {
                    type: "upload",
                    userName: this.userName,
                    userNick: this.userNick,
                    photoData: this.dataPhoto
                };
                this.socket.send(JSON.stringify(uploadPhoto));
                this.destroy()
            } else {
                alert('Вы не выбрали фотографию')
            }
        }

        this.cancelBtn.addEventListener('click', this.cancelHandler, {once: true})
        this.uploadBtn.addEventListener('click', this.uploadHandler)
    }

    destroy() {
        this.uploadBtn.removeEventListener('click', this.uploadHandler)
        this.dropArea.removeEventListener('dragenter', this.dragActive)
        this.dropArea.removeEventListener('dragover', this.dragActive)
        this.dropArea.removeEventListener('dragleave', this.dragDisable)
        this.dropArea.removeEventListener('drop', this.droped)
        this.dropArea.removeEventListener('change', this.choosedFile)
        document.body.removeChild(this.modal)
    }
}