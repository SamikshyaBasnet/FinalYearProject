import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Popover } from '@material-ui/core';
import { useSelector } from 'react-redux';
import UserInfo from '../UserInfo';
import './activeuser.css';
import Axios from '../API/api';
import { MessageSharp } from '@material-ui/icons';

const ActiveUserList = () => {

    // Get user list from redux store
    //  const { activeWorkspace, activeChannel } = useSelector((state) => state.chat);

    const { allUserList } = useSelector((state) => state.chat);
    const { activeWorkspace, activeUserList } = useSelector((state) => state.chat);

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


    return (
        <div className="user-list-container">
            <List className="users-list">
                <ListItem className="users-list-title">Users List</ListItem>
                {allUserList.map((user) => {
                    return (
                        <ListItem button className="user-list-item" onClick={e => handleUserClick(e, user.username)}>
                            <ListItemAvatar key={user.username} className="message-user-icon">
                                {/* <Avatar>
                                    <img alt="user icon" height="48" />
                                    <div className="user-list-online"></div>
                                </Avatar> */}

                                <div className="user-profile">
                                    <p className="user">
                                        {user.username.charAt(0).toUpperCase()}
                                    </p>
                                </div>

                            </ListItemAvatar>
                            <ListItemText>{user.username}</ListItemText>
                        </ListItem>
                    );
                })}

            </List>

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

