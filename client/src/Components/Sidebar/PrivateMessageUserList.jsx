import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Slide, Button, Typography } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { signOut, changePMUser } from '../../actions';
import '../../App.css';

export default function PrivateMessageUserList() {
    // Get from Redux store
    const { privateMessages } = useSelector((state) => state.chat);
    const userList = Object.keys(privateMessages);
    const dispatch = useDispatch();

    // Signs the user out
    const handleSignOut = () => {
        localStorage.clear();
        dispatch(signOut());
    };

    return (
        <div className="channels-container">
            <List className="channel-list">
                {userList.map((userItem, i) => (
                    < Slide direction="right" in={true} timeout={200 * (i + 1)} key={i}>
                        <ListItem button className="user-item" onClick={() => dispatch(changePMUser(userItem))}>
                            {/* <Avatar>
                                {' '}
                                <img className="user" src={process.env.PUBLIC_URL + '/user.png'} alt="user icon" height="48" />{' '}
                            </Avatar> */}
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

            {/* <div className="user-options">
                <ListItem className="user-info">
                    <ListItemAvatar>
                        <Avatar>
                            <Person />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={user.userName} />
                    <Button className="modal-button" onClick={handleSignOut}> out</Button>
                </ListItem>
            </div> */}
        </div >
    );
}
