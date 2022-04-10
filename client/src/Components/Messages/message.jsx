import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import SmileyFace from '@material-ui/icons/SentimentVerySatisfied';
import { sendMessage, sendPrivateMessage } from '../../actions';
import '../SendMessage/sendmessage.css';
import { IoMdAddCircle } from 'react-icons/io';
import Image from './image';
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Fade,
    Popover,
    Box,
    Tooltip,
    Menu,
    MenuItem,
    Button,
    Modal

} from '@material-ui/core';
import moment from 'moment';
import DomPurify from 'dompurify';
import UserInfo from '../UserInfo/';
import '../../App.css';
import './message.css';
import '../SendMessage/sendmessage.css';
import Axios from '../API/api';
import { GoPin } from 'react-icons/go';


export default function SendMessages() {

    // Get State from Redux Store
    const { activeWorkspace, activeChannel, activeView, activePMUser } = useSelector((state) => state.chat);
    const chatStore = useSelector((state) => state.chat);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const channelId = activeChannel.split('-')[1];

    // Local state
    const [chatMessage, setChatMessage] = useState('');
    const [emojiMenuVisible, setEmojiMenuVisible] = useState(false);
    const [placeholderTitle, setPlaceholderTitle] = useState('');
    const [file, setFile] = useState();

    //messages
    const [userInfoVisible, setUserInfoVisible] = useState(false);
    const [messageIndex, setMessageIndex] = useState(12);
    const [loadMessages, setLoadMessages] = useState(false);
    const [userName, setUserName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    let [pinnedMessage, setPinnedMessage] = useState([]);
    let [remainingPinnedMessage, setRemainingPinnedMessage] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //messages section all use

    // ref to message container (for keeping scroll to bottom of chat)
    let messageContainerBottomRef = document.getElementById('messagesContainerBottom');
    let messageContainerRef = document.getElementById('messagesContainer');

    // Get message list from channel or from specific user

    let messages = [{
        from: '',
        to: '',
        msg: '',
        date: Date,
    }]
    let messagesLength = 0;


    if (activeView === 'workspaces') {

        messages = chatStore.workspaces[activeWorkspace]['channels'][activeChannel];
        messagesLength = messages.length;

    } else {
        messages = chatStore.privateMessages[activePMUser];
        // If no messages need to make empty array
        if (messages === undefined) {
            messages = [];
        }
        messagesLength = messages.length;
    }

    // Scroll to bottom of container if were not loading new messages
    useEffect(() => {
        if (messageContainerBottomRef && messageContainerRef) {
            if (loadMessages) {
                messageContainerRef.scroll(0, 60);
            } else {
                messageContainerBottomRef.scrollIntoView({ block: 'end', behavior: 'smooth' });
            }
        }
    }, [loadMessages, messages, messageContainerRef, messageContainerBottomRef]);

    // Checks is message is a code block
    const isTextCodeBlock = (message = '') => {
        if (message.startsWith('```') && message.endsWith('```')) return true;
        else return false;
    };

    // Handles to load more messages when scroll at top
    const handleScrollTop = (e) => {
        const element = e.target;
        if (element.scrollTop > 60) {
            setLoadMessages(false);
        }
        if (element.scrollTop === 0) {
            if (messagesLength > messageIndex) {
                setTimeout(() => {
                    setLoadMessages(true);
                    if (messageIndex + 12 > messagesLength) {
                        setMessageIndex(messagesLength);
                    } else {
                        setMessageIndex(messageIndex + 12);
                    }
                }, 400);
            }
        }
    };

    // Formats the code block
    const formatCode = (message) => {
        return message.split('```')[1];
        // console.log("format code ", message);
    };

    // Handles clicks for setting anchor to User Info (To private message)
    const handleUserClick = (e, userName) => {
        setUserName(userName);
        setUserInfoVisible(true);
        setAnchorEl(e.currentTarget);
    };

    // Closes popup of User Info
    const handlePopoverClose = () => {
        setUserInfoVisible(false);
        setAnchorEl(null);
    };

    // const handlePinMessage = (message) => {
    //     Axios.post(`/message/pin?message=${message}`).then((response) => {

    //     })
    // }

    const handleUnpinMessage = (message) => {
        // Axios.post(`/message/unpin?message=${message}`).then((response) => {
        //     console.log("respones pin message from", message)
        //     pinnedMessage.filter(message => message.message !== message)
        //     setPinnedMessage(pinnedMessage);
        //     console.log("after removing=", pinnedMessage)
        // });

    }

    //load pin msg
    // useEffect(() => {
    //     Axios.get(`/channel/pinnedmessage?channelId=${channelId}`).then((response) => {
    //         //  console.log("pinned message=", response.data);
    //         setPinnedMessage(response.data);

    //     })
    // }, [messages]);
    // console.log("pinned messages = ", pinnedMessage)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: '241px',
        bgcolor: '#320635',
        boxShadow: 24,
        p: 4,
        overflowY: "scroll",


    };

    // Check active view to determine where we send our messages
    useEffect(() => {
        if (activeView === 'workspaces') {
            setPlaceholderTitle(activeChannel.split('-')[0]);
        } else if (activeView === 'home') {
            setPlaceholderTitle(activePMUser);
        }
    }, [activeView, activeChannel, activePMUser]);



    function selectFile(e) {
        setChatMessage(e.target.files[0].name)
        setFile(e.target.files[0]);
    }
    // Handles submission of messages
    // Dispatches event and sets TextField value to empty
    function handleSubmit(message) {

        if (activeView === 'workspaces' && message.type === 'channelMessage') {
            dispatch(sendMessage(message));


        } else if (activeView === 'home' && message.type === 'privateMessage') {
            dispatch(sendPrivateMessage(message));

        }
        setChatMessage('');
        setFile('');

    }

    const [imageSrc, setImageSrc] = useState("");
    // Handles enter event to submit message
    function handleKeyPress(e) {

        if (e.key === 'Enter' && !e.shiftKey) {
            if (activeView === 'workspaces')
                if (file) {
                    console.log("chat msg,", chatMessage.type)
                    const blob = new Blob([file]);
                    var reader = new FileReader();

                    console.log("reader result", reader);
                    reader.onload = function () {
                        setImageSrc(reader.result)
                    }

                    reader.readAsDataURL(blob);

                    handleSubmit({
                        workspace: activeWorkspace,
                        channel: activeChannel,
                        from: user.userName,
                        msg: file,
                        type: 'channelMessage',
                        msgType: "file",
                        mimeType: file.type,
                        fileName: file.name,
                    });
                    console.log("msg", file);

                    // setImageSrc(reader.result);

                    console.log("img src,", imageSrc)
                }
                else {

                    handleSubmit({
                        workspace: activeWorkspace,
                        channel: activeChannel,
                        from: user.userName,
                        msg: chatMessage,
                        type: 'channelMessage',
                    });
                }
            else if (activeView === 'home')
                if (file) {
                    handleSubmit({
                        from: user.userName,
                        msg: file,
                        type: 'privateMessage',
                        msgType: "file",
                        mimeType: file.type,
                        fileName: file.name,
                    });
                } else {
                    handleSubmit({
                        from: user.userName,
                        to: activePMUser,
                        msg: chatMessage,
                        type: 'privateMessage',
                    });
                }

        }
    }

    // Handles changes in message box (catches enter to not send new lines. (Must send SHIFT+ENTER))
    function handleOnChange(e) {
        if (e.target.value !== '\n') setChatMessage(e.target.value);
    }

    // When click emoji, close the menu
    function handleEmojiClick(e) {
        setChatMessage(chatMessage + e.native);
        setEmojiMenuVisible(false);
    }
    const hiddenFileInput = React.useRef(null);

    const handleFileClick = (e) => {
        hiddenFileInput.current.click();
    }


    // Closes emoji menu when clicked outside the div
    window.onclick = (e) => {
        if (String(e.target.className).includes('send-message-emoji-menu')) setEmojiMenuVisible(false);
    };


    return (
        <React.Fragment>
            <div>
                {messages.length === 0 && (
                    <div style={{
                        height: '100%', width: '100%', display: 'flex', justifyContent: 'center', zIndex: -1, alignItems: 'center'
                    }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                textAlign: 'center',
                                padding: '1em',
                                fontFamily: 'roboto'
                            }}
                        >

                            <div style={{ marginTop: '1em', flexBasis: '100%', color: 'white' }}>
                                {' '}
                                Start Messaging Now!
                            </div>

                        </div>
                    </div>
                )}
                <div
                    id="messagesContainer"
                    className="messages-container"
                    onScroll={e => handleScrollTop(e)}
                    ref={element => (messageContainerRef = element)}
                >
                    <div className="pinned_msg_container">
                        <Button onClick={handleOpen}
                            className="modal-button"
                            variant="contained"
                            color="primary">See Pinned Message
                        </Button>
                    </div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{ ...style, width: 450 }}>
                            <div className="pinned_msg">
                                <h4>Pinned Messages</h4>
                                {/* <p>{pinnedMessage}</p> */}

                                <div>
                                    {pinnedMessage.map((msg, i) => {
                                        return (
                                            <ListItem className="message" key={i}>
                                                <ListItemAvatar className="message-user-icon">
                                                    <div className="user-profile">
                                                        <p className="user">
                                                            {msg.username.charAt(0).toUpperCase()}
                                                        </p>
                                                    </div>

                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <div className="message-user">
                                                            {msg.username.toLowerCase()}
                                                            <div className="message-date">{` - ${moment(msg.date).format('LLL')}`}</div>
                                                            <p style={{ textDecoration: 'underline' }} onClick={handleUnpinMessage(msg.message)}>Unpin</p>
                                                        </div>
                                                    }

                                                    secondary={msg.message}
                                                    className="message-text"
                                                />

                                            </ListItem>
                                        )

                                    })}
                                </div>
                            </div>
                        </Box>
                    </Modal>

                    <List>

                        {messages !== null
                            ? messages.slice(messagesLength - messageIndex, messagesLength).map((message, i) => {
                                // Filter for null messages (dummy message on backend should fix...)
                                return (

                                    <Fade in={true} timeout={500}>
                                        <ListItem className="message" key={i}>
                                            <ListItemAvatar className="message-user-icon">
                                                <div className="user-profile">
                                                    <p className="user">
                                                        {message.from.charAt(0).toUpperCase()}
                                                    </p>
                                                </div>

                                            </ListItemAvatar>


                                            {message.msgType === "file" ?

                                                // <Image fileName={message.fileName} blob={blob} />
                                                //    alert("file file")
                                                // <ListItemText
                                                //     primary={
                                                //         <div className="message-user">
                                                //             {message.from.toLowerCase()}
                                                //             <div className="message-date">{` - ${moment(message.date).format('LLL')}`}</div>
                                                //             {/* <GoPin onClick={handlePinMessage(message.msg)} style={{ marginLeft: '20px' }} /> */}
                                                //         </div>

                                                //     }

                                                //     secondary={<img src={imageSrc} alt="img" />}
                                                //     className="message-text"
                                                // />
                                                <img src={imageSrc} alt="img" />
                                                : <ListItemText
                                                    primary={
                                                        <div className="message-user">
                                                            {message.from.toLowerCase()}
                                                            <div className="message-date">{` - ${moment(message.date).format('LLL')}`}</div>
                                                            {/* <GoPin onClick={handlePinMessage(message.msg)} style={{ marginLeft: '20px' }} /> */}
                                                        </div>

                                                    }

                                                    secondary={message.msg}
                                                    className="message-text"
                                                />

                                            }

                                            {/* )} */}
                                        </ListItem>
                                    </Fade>
                                );
                            })
                            : null}
                    </List>
                    <div ref={element => (messageContainerBottomRef = element)} id="messagesContainerBottom"></div>
                    <Popover
                        id="user-info"
                        open={userInfoVisible}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                        }}
                    >
                        <UserInfo userName={userName} setUserInfoVisible={setUserInfoVisible} />
                    </Popover>

                </div>
            </div>

            <div className="send-message-border" />
            <div className="send-message-container">
                <TextareaAutosize
                    aria-label="empty textarea"
                    placeholder={`Send a message to  #${placeholderTitle}`}
                    className="message-text-area"
                    value={chatMessage}
                    onChange={e => handleOnChange(e)}
                    onKeyPress={e => handleKeyPress(e)}
                />
                <IoMdAddCircle onClick={handleFileClick} className="send-file-button" />
                <input type="file"
                    ref={hiddenFileInput}
                    onChange={selectFile}
                    style={{ display: 'none' }}
                />
                <SmileyFace className="send-message-emoji-button" onClick={() => setEmojiMenuVisible(!emojiMenuVisible)} />

            </div>
            <div className={emojiMenuVisible ? 'send-message-emoji-menu show' : 'send-message-emoji-menu hide'}>
                <div className="emoji-wrapper">
                    <Picker onSelect={e => handleEmojiClick(e)} />
                </div>

            </div>
        </React.Fragment>
    );
}
