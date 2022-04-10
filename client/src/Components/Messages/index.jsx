import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
import Axios from '../API/api';
import { GoPin } from 'react-icons/go';


export default function Messages(props) {
    // Get States from Redux Store
    const chatStore = useSelector((state) => state.chat);
    const { msgtype } = props;

    const { activeWorkspace, activeChannel, activeView, activePMUser } = chatStore;

    const channelId = activeChannel.split('-')[1];
    // Local states
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


    // ref to message container (for keeping scroll to bottom of chat)
    let messageContainerBottomRef = document.getElementById('messagesContainerBottom');
    let messageContainerRef = document.getElementById('messagesContainer');

    // Get message list from channel or from specific user

    let messages = [{
        from: '',
        to: '',
        msg: '',
        msgtype: { msgtype },
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

    const handlePinMessage = (message) => {
        Axios.post(`/message/pin?message=${message}`).then((response) => {

        })
    }

    const handleUnpinMessage = (message) => {
        // Axios.post(`/message/unpin?message=${message}`).then((response) => {
        //     console.log("respones pin message from", message)
        //     pinnedMessage.filter(message => message.message !== message)
        //     setPinnedMessage(pinnedMessage);
        //     console.log("after removing=", pinnedMessage)
        // });

    }

    //load pin msg
    useEffect(() => {
        Axios.get(`/channel/pinnedmessage?channelId=${channelId}`).then((response) => {
            //  console.log("pinned message=", response.data);
            setPinnedMessage(response.data);

        })
    }, [messages]);
    console.log("pinned messages = ", pinnedMessage)

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

    return (
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

                                        {isTextCodeBlock(message.msg) ? (
                                            <ListItemText
                                                primary={
                                                    <div className="message-user" onClick={e => handleUserClick(e, message.from)}>
                                                        {message.from.toLowerCase()}
                                                        <div className="message-date">{` - ${moment(message.date).format('LLL')}`}</div>
                                                    </div>
                                                }
                                                secondary={
                                                    <pre className="prettyprint">
                                                        <div dangerouslySetInnerHTML={{ __html: DomPurify.sanitize(formatCode((message.msg))) }}></div>
                                                    </pre>
                                                }
                                                className="message-text"
                                            />
                                        ) : (

                                            <ListItemText
                                                primary={
                                                    <div className="message-user">
                                                        {message.from.toLowerCase()}
                                                        <div className="message-date">{` - ${moment(message.date).format('LLL')}`}</div>
                                                        <GoPin onClick={handlePinMessage(message.msg)} style={{ marginLeft: '20px' }} />
                                                    </div>

                                                }

                                                secondary={message.msg}
                                                className="message-text"
                                            />
                                        )}
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
    );
}
