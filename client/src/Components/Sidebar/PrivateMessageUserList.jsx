import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Slide, Button, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { changePMUser } from '../../actions';
import '../../App.css';

export default function PrivateMessageUserList() {
    // Get from Redux store
    const { privateMessages } = useSelector((state) => state.chat);
    const userList = Object.keys(privateMessages);
    const dispatch = useDispatch();


    return (
        <div className="channels-container">
            <List className="channel-list">
                {userList.map((userItem, i) => (
                    < Slide direction="right" in={true} timeout={200 * (i + 1)} key={i}>
                        <ListItem button className="user-item" onClick={() => dispatch(changePMUser(userItem))}>

                            <div className="user-profile">
                                <p className="user">
                                    {userItem.charAt(0).toUpperCase()}
                                </p>
                            </div>
                            <Typography variant="body1" className="user-list-name">
                                {userItem}
                            </Typography>
                        </ListItem>
                    </Slide>
                ))}
            </List>

        </div >
    );
}
