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
     fileType: '',
     reaction: '',
     msg: '',
 }

 let PrivateMessage = {
     from: '',
     to: '',
     msg: '',
     msgType: '',
     fileType: '',
     reaction: '',
 }

 module.exports = {
     SocketClientList,
     PrivateMessage,
     Message,
     SocketAction
 }