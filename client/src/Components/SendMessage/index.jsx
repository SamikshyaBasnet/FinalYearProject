// import React, { useState, useEffect, ChangeEvent } from 'react';
// import { useSelector } from 'react-redux';
// import { useDispatch } from 'react-redux';
// import TextareaAutosize from '@material-ui/core/TextareaAutosize';
// import 'emoji-mart/css/emoji-mart.css';
// import { Picker } from 'emoji-mart';
// import SmileyFace from '@material-ui/icons/SentimentVerySatisfied';
// import { sendMessage, sendPrivateMessage } from '../../actions';
// import './sendmessage.css';
// import { IoMdAddCircle } from 'react-icons/io';

// export default function SendMessage() {

//     // Get State from Redux Store
//     const { activeWorkspace, activeChannel, activeView, activePMUser } = useSelector((state) => state.chat);
//     const { userName } = useSelector((state) => state.user);
//     const dispatch = useDispatch();

//     // Local state
//     const [chatMessage, setChatMessage] = useState('');
//     const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);
//     const [placeholderTitle, setPlaceholderTitle] = useState('');
//     const [file, setFile] = useState();

//     // Check active view to determine where we send our messages
//     useEffect(() => {
//         if (activeView === 'workspaces') {
//             setPlaceholderTitle(activeChannel.split('-')[0]);
//         } else if (activeView === 'home') {
//             setPlaceholderTitle(activePMUser);
//         }
//     }, [activeView, activeChannel, activePMUser]);

//     // Checks is message is valid (not just spaces)
//     function isValidMessage(msg) {
//         let validMessage = true;
//         // Check if empty stirng
//         if (msg.trim() === '') validMessage = false;
//         return validMessage;
//     }

//     // Will format out multiple line breaks to 2 max
//     function formatMessage(msg) {
//         return msg.replace(/(\r\n|\r|\n){3,}/g, '$1\n\n');
//     }

//     // Handles submission of messages
//     // Dispatches event and sets TextField value to empty
//     function handleSubmit(message) {
//         if (isValidMessage(message.msg)) {
//             message.msg = formatMessage(message.msg);
//             // Send message to server, or user
//             if (activeView === 'workspaces' && message.type === 'channelMessage') {
//                 dispatch(sendMessage(message));

//             } else if (activeView === 'home' && message.type === 'privateMessage') {
//                 dispatch(sendPrivateMessage(message));

//             }
//             setChatMessage('');
//         } else {
//             // throw some error
//         }
//     }

//     // Handles enter event to submit message
//     function handleKeyPress(e) {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             if (activeView === 'workspaces')
//                 if (file) {
//                     handleSubmit({
//                         workspace: activeWorkspace,
//                         channel: activeChannel,
//                         from: userName,
//                         msg: file,
//                         type: 'channelMessage',
//                         msgType: "file",
//                         mimeType: file.type,
//                         fileName: file.name,
//                     });
//                 }
//                 else {

//                     handleSubmit({
//                         workspace: activeWorkspace,
//                         channel: activeChannel,
//                         from: userName,
//                         msg: chatMessage,
//                         type: 'channelMessage',
//                     });
//                 }
//             else if (activeView === 'home')
//                 if (file) {
//                     handleSubmit({
//                         from: userName,
//                         msg: file,
//                         type: 'privateMessage',
//                         msgType: "file",
//                         mimeType: file.type,
//                         fileName: file.name,
//                     });
//                 } else {
//                     handleSubmit({
//                         from: userName,
//                         to: activePMUser,
//                         msg: chatMessage,
//                         type: 'privateMessage',
//                     });
//                 }

//         }
//     }

//     // Handles changes in message box (catches enter to not send new lines. (Must send SHIFT+ENTER))
//     function handleOnChange(e) {
//         if (e.target.value !== '\n') setChatMessage(e.target.value);
//     }

//     // When click emoji, close the menu
//     function handleEmojiClick(e) {
//         setChatMessage(chatMessage + e.native);
//         setEmojiMenuVisible(false);
//     }
//     const hiddenFileInput = React.useRef(null);

//     const handleFileClick = (e) => {
//         hiddenFileInput.current.click();
//     }

//     function selectFile(e) {
//         setChatMessage(e.target.files[0].name)
//         setFile(e.target.files[0]);
//     }
//     // Closes emoji menu when clicked outside the div
//     window.onclick = (e) => {
//         if (String(e.target.className).includes('send-message-emoji-menu')) setEmojiMenuVisible(false);
//     };

//     return (
//         <React.Fragment>
//             <div className="send-message-border" />
//             <div className="send-message-container">
//                 <TextareaAutosize
//                     aria-label="empty textarea"
//                     placeholder={`Send a message to  #${placeholderTitle}`}
//                     className="message-text-area"
//                     value={chatMessage}
//                     onChange={e => handleOnChange(e)}
//                     onKeyPress={e => handleKeyPress(e)}
//                 />
//                 <IoMdAddCircle onClick={handleFileClick} className="send-file-button" />

//                 <input type="file"
//                     ref={hiddenFileInput}
//                     onChange={selectFile}
//                     style={{ display: 'none' }}
//                 />
//                 <SmileyFace className="send-message-emoji-button" onClick={() => setEmojiMenuVisible(!emojiMenuVisible)} />
//                 {/* <IoIosSend className="send-msg-button" onClick={(e => handleSubmit(e))} /> */}

//             </div>
//             <div className={emojiMenuVisible ? 'send-message-emoji-menu show' : 'send-message-emoji-menu hide'}>
//                 <div className="emoji-wrapper">
//                     <Picker onSelect={e => handleEmojiClick(e)} />
//                 </div>

//             </div>
//         </React.Fragment>
//     );
// }
