const WebSocketServer = new require('ws');

const clients = {};
const membersList = {};

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

const responseMemberList = (ws) => {
    const responseMember = {
        type: 'connect',
        memberList: membersList
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
                    clients[key] = ws;
                    clients[key].userName = msgParse.userName;
                    clients[key].userNick = msgParse.userNick;

                    await responseMemberList(ws)
                    membersList[id] = {};
                    membersList[key].userName = msgParse.userName;
                    membersList[key].userNick = msgParse.userNick;

                    const responseAuth = {
                        type: 'auth',
                        isReLogin: true,
                        userName: msgParse.userName,
                        userNick: msgParse.userNick
                    }
                    responseForAll(JSON.stringify(responseAuth));

                    return
                }
            }
            id = Date.now();
            clients[id] = ws;
            clients[id].userName = msgParse.userName;
            clients[id].userNick = msgParse.userNick;


            membersList[id] = {};
            membersList[id].userName = msgParse.userName;
            membersList[id].userNick = msgParse.userNick;
            const responseMsg = {
                type: 'auth',
                isReLogin: false,
                userName: msgParse.userName,
                userNick: msgParse.userNick
            }
            console.log(clients[id].userName)
            for (const key in clients) {
                responseMemberList(clients[key])
            }

            clients[id].send(JSON.stringify(responseMsg));

            return id
        }
        if (msgParse.type == "message") {
            const responseMsg = {
                type: 'message',
                userName: msgParse.userName,
                userNick: msgParse.userNick,
                text: msgParse.text,
                date: new Date()
            }
            for (const key in clients) {
                clients[key].send(JSON.stringify(responseMsg));
            }
        }
        /*for (const key in clients) {
            clients[key].send(message);
        }*/
    });

    ws.on('close', function (msg) {
        for (const key in membersList) {
            try {
                if (membersList[key].userName == clients[id].userName && membersList[key].userNick == clients[id].userNick) {
                    delete membersList[key]
                }
            } catch (e) {
                return
            }

        }

        console.log(membersList)
        const responseAuth = {
            type: 'connect',
            memberList: membersList
        }
        responseForAll(JSON.stringify(responseAuth));
    });
});
console.log("Сервер запущен на порту 8080");