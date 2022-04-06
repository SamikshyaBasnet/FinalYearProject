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
     msg: '',
 }

 let PrivateMessage = {
     from: '',
     to: '',
     msg: '',
 }

 module.exports = {
     SocketClientList,
     PrivateMessage,
     Message,
     SocketAction
 }