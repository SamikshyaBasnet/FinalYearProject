import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Popover } from '@material-ui/core';
import { useSelector } from 'react-redux';
import UserInfo from '../UserInfo';
import './activeuser.css';
import Axios from '../API/api';
import { MessageSharp } from '@material-ui/icons';
import { HiUsers } from 'react-icons/hi'
import socketClient from "socket.io-client";

const ActiveUserList = () => {

    // Get user list from redux store
    //  const { activeWorkspace, activeChannel } = useSelector((state) => state.chat);

    const { allUserList } = useSelector((state) => state.chat);
    const { activeWorkspace, activeUserList } = useSelector((state) => state.chat);
    const user = useSelector((state) => state.user);
    // Local state
    const [userInfoVisible, setUserInfoVisible] = useState(false);
    const [userName, setUserName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

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
    }
    // Get active user list in given server

    const userId = user.userId
    const baseUrl = 'http://localhost:5000';
    var socket = socketClient(baseUrl);
    // socket.on('user_connected', (user) => {
    //     //You may have not have seen this for loop before. It's syntax is for(key in obj)
    //     //Our usernames are keys in the object of onlineUsers.
    //     for (userName in allUserList) {
    //         ('.users-online').append(`<div class="user-online">${userName}</div>`);
    //     }
    // })
    return (
        <div className="user-list-container">
            <List className="users-list">
                <div className="d-flex">
                    <ListItem className="users-list-title">Users List</ListItem>
                    <ListItem className="users-list-title" style={{ fontSize: "26px" }}> <HiUsers /></ListItem>
                </div>

                {allUserList.map((user) => {
                    return (
                        <ListItem button className="user-list-item" onClick={e => handleUserClick(e, user.username)}>
                            <ListItemAvatar className="message-user-icon">
                                {user.profile === "" ?
                                    <div key={user.username} className="user-profile">
                                        <p className="user">
                                            {user.username.charAt(0).toUpperCase()}

                                        </p>
                                    </div> :
                                    <div>
                                        <img key={user.username} className='user-profile-pic' src={`/uploads/${user.profile}`} alt="" height="20" width="20" />
                                        {/* <div className="user-list-online"></div> */}
                                    </div>

                                }
                                {/* <Avatar>
                  <img src={process.env.PUBLIC_URL + '/user.png'} alt="user icon" height="48" />
                  <div className="user-list-online"></div>
                </Avatar> */}
                            </ListItemAvatar>
                            <ListItemText>{user.username}</ListItemText>
                        </ListItem>
                    );
                })}

            </List>
            <div className="users-online"></div>
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
    )
}


export default ActiveUserList;

