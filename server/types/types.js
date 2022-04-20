 let SocketClientList = {
     userId: '',
     userName: '',
     id: '',
 }

 let SocketAction = {
     type: '',
     payload: {},
 }

 let Message = {
     workspace: '',
     channel: '',
     from: '',
     msgType: '',
     msg: '',
 }

 let PrivateMessage = {
     from: '',
     to: '',
     msg: '',
     msgType: '',
 }

 module.exports = {
     SocketClientList,
     PrivateMessage,
     Message,
     SocketAction
 }