module.exports = class ChatMembers {
    constructor(socket) {
        this.socket = socket
        this.membersList = document.querySelector('.users-list')

    }

    getAllMembers(fullMembersList){
        for (const key in fullMembersList.membersList) {
            this.addMember(fullMembersList.membersList[key])
        }
    }
    addMember(responseMsg) {
        const profileMember = `<img src="${responseMsg.photoData||'https://via.placeholder.com/120x120?text=No+Image'}" class=\"user-item__image\" data-userID="${responseMsg.userName}${responseMsg.userNick}"/>\n
                    <div class=\"user-item__name\">${responseMsg.userName} aka ${responseMsg.userNick}</div>\n`
        const newMemberLi = document.createElement('li')
        newMemberLi.classList.add('users-list__item')
        newMemberLi.classList.add('user-item')
        newMemberLi.innerHTML = profileMember
        this.membersList.append(newMemberLi)
    }

    removeMember(responseMsg) {
        this.dataUser = this.membersList.querySelectorAll(`[data-userID]`)
        this.dataUser.forEach((elem) => {
            if (elem.dataset.userid === responseMsg.userName + responseMsg.userNick) {
              elem.parentElement.outerHTML=''
            }
        })
    }

    updateAvatar(responseMsg) {
        this.dataUser = this.membersList.querySelectorAll(`[data-userID]`)
        this.dataUser.forEach((elem) => {
            if (elem.dataset.userid === responseMsg.userName + responseMsg.userNick) {
                elem.src = responseMsg.photoData
            }
        })
    }

    counterMember() {
        this.dataUser = this.membersList.querySelectorAll(`[data-userID]`)
        const membersCounter = document.querySelector('.chat-properies__members')
        const counterMember = this.dataUser.length
        switch (true) {
            case counterMember==1:
                membersCounter.textContent = '1 участник'
                break

            case counterMember >= 2 && counterMember <= 4:
                membersCounter.textContent=`${counterMember} участника`
                break

            case counterMember > 5:
                membersCounter.textContent=`${counterMember} участников`
                break
        }
    }

}