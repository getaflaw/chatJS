const WebSocketServer = new require('ws');

const clients = {};
const membersList = {};
const dataMembers = {};

const responseForAll = (json) => {
    for (const key in clients) {
        clients[key].send(json);
    }
}
const responseOtherUsers = (json, id) => {
    for (const key in clients) {
        if (clients[key] != clients[id]) {
            clients[key].send(json);
        }
    }
}

const responseMemberList = (ws,msgParse) => {
    const responseMember = {
        type: 'connect',
        userName: msgParse.userName,
        userNick: msgParse.userNick,
        photoData: msgParse.photoData

    }
    ws.send(JSON.stringify(responseMember));
}

const webSocketServer = new WebSocketServer.Server({port: 8080});

webSocketServer.on('connection', function (ws) {


    let id;
    ws.on('message', async function (message) {
        const msgParse = JSON.parse(message)
        if (msgParse.type == "auth") {
            for (const key in clients) {
                if (clients[key].userName == msgParse.userName && clients[key].userNick == msgParse.userNick) {
                    id = key
                    clients[id] = ws;
                    clients[id].userName = msgParse.userName;
                    clients[id].userNick = msgParse.userNick;

                    const responseAuth = {
                        type: 'auth',
                        isReLogin: true,
                        userName: msgParse.userName,
                        userNick: msgParse.userNick,
                        membersList: membersList
                    }
                    clients[id].send(JSON.stringify(responseAuth));
                    membersList[id] = {};
                    membersList[id].userName = msgParse.userName;
                    membersList[id].userNick = msgParse.userNick;

                    if (dataMembers[id].photoData) {
                        responseAuth.photoData = dataMembers[id].photoData
                        membersList[id].photoData = dataMembers[id].photoData
                    }
                    for (const key in clients) {
                        responseMemberList(clients[key],msgParse)
                    }

                    return
                }
            }

            id = Date.now();
            clients[id] = ws;
            clients[id].userName = msgParse.userName;
            clients[id].userNick = msgParse.userNick;
            dataMembers[id]= {
                userName: msgParse.userName,
                userNick: msgParse.userNick
            }
            const responseMsg = {
                type: 'auth',
                isReLogin: false,
                userName: msgParse.userName,
                userNick: msgParse.userNick,
                membersList: membersList
            }
            clients[id].send(JSON.stringify(responseMsg));

            membersList[id] = {};
            membersList[id].userName = msgParse.userName;
            membersList[id].userNick = msgParse.userNick;
            for (const key in clients) {
                responseMemberList(clients[key],msgParse)
            }

            return id
        }
        if (msgParse.type == "message") {
            const responseMsg = {
                type: 'message',
                userName: msgParse.userName,
                userNick: msgParse.userNick,
                text: msgParse.text,
                date: `${new Date().getHours()}:${new Date().getMinutes()}`
            }
            if (msgParse.photoData) {
                responseMsg.photoData = msgParse.photoData
            }
            for (const key in clients) {
                clients[key].send(JSON.stringify(responseMsg));
            }
        }
        if (msgParse.type == "upload") {

            for (const key in membersList) {
                if (membersList[key].userName == msgParse.userName && membersList[key].userNick == msgParse.userNick) {
                    membersList[key].photoData = msgParse.photoData;
                    dataMembers[key].photoData = msgParse.photoData;
                }
            }
            const updatePhotoMember = {
                type: 'updateMember',
                userName: msgParse.userName,
                userNick: msgParse.userNick,
                photoData: msgParse.photoData
            }

            responseForAll(JSON.stringify(updatePhotoMember))
        }
    });

    ws.on('close', function (msg) {
        for (const key in membersList) {
            try {
                if (membersList[key].userName == clients[id].userName && membersList[key].userNick == clients[id].userNick) {
                    const responseAuth = {
                        type: 'disconnect',
                        userName: membersList[key].userName,
                        userNick: membersList[key].userNick
                    }
                    responseForAll(JSON.stringify(responseAuth));
                    delete membersList[key]
                }
            } catch (e) {
                return
            }

        }


    });
});
console.log("Сервер запущен на порту 8080");