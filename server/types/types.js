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
     msg: '',
 }

 let PrivateMessage = {
     from: '',
     to: '',
     msg: '',
     msgType: '',
     fileType: '',
 }

 module.exports = {
     SocketClientList,
     PrivateMessage,
     Message,
     SocketAction
 }