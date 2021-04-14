module.exports = class LoadAvatarModal {
    constructor() {
    }

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

    buildUploadModal() {
        const templateUploadModal = document.createElement("template");
        templateUploadModal.innerHTML = this.templateModal();
        document.body.append(templateUploadModal.content)
        this.dropPhotoEvent()
    }

    dropPhotoEvent() {
        let avatarFile;
        const fileReader = new FileReader()
        const avatarImg = document.getElementById('avatarPhoto')
        const dropArea = document.getElementById('dropImageZone')

        dropArea.addEventListener('dragenter', (event) => {
            event.preventDefault()
            event.stopPropagation()
            dropArea.classList.add('has-upload')
        })
        dropArea.addEventListener('dragover', (event) => {
            event.preventDefault()
            event.stopPropagation()
            dropArea.classList.add('has-upload')
        })
        dropArea.addEventListener('dragleave', (event) => {
            event.preventDefault()
            event.stopPropagation()
            dropArea.classList.remove('has-upload')
        })
        dropArea.addEventListener('drop', (event) => {
            event.preventDefault()
            event.stopPropagation()
            dropArea.classList.remove('has-upload')
            dropArea.style.border = 'none';
            dropArea.classList.add('already-upload')
            avatarFile = event.dataTransfer.files[0]
            fileReader.readAsDataURL(avatarFile);
        })
        fileReader.addEventListener('load', function () {
            dropArea.style.backgroundImage=`url("${fileReader.result}")`;
           // avatarImg.src = fileReader.result;
            //const uploadPhoto = {
            //   type: "upload",
            //   userName: userProfileData.userName,
            // userNick: userProfileData.userNick,
            //  photoData: fileReader.result
            // };
            // socket.send(JSON.stringify(uploadPhoto));
        });
        dropArea.addEventListener('change', function (e) {
            const file = e.target.files[0];
            dropArea.classList.add('already-upload')
            if (file) {
                if (file.size > 300 * 1024) {
                    alert('Слишком большой файл');
                } else {
                    fileReader.readAsDataURL(file);
                }
            }
        });
    }

    destroy() {
        const modal = document.querySelector('.modal-upload')
        document.body.removeChild(modal)
    }
}