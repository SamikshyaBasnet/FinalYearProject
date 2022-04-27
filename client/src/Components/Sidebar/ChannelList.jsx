import React, { useState, useEffect } from 'react';
import { Person, PersonAddOutlined, MoreVert, ExpandMore } from '@material-ui/icons';
import { FiSettings } from 'react-icons/fi';

import {
    List,
    ListItem,

    Tooltip,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Slide,
    Button
} from '@material-ui/core';
import { IoMdAdd } from 'react-icons/io';
import {
    changeChannel,
    signOut,
    changeView,

} from '../../actions';
import './Sidebar.css';
import '../../App.css';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../API/api';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import PrivateMessageUserList from './PrivateMessageUserList';
import socketClient from "socket.io-client";
function ChannelList(props) {
    const baseUrl = 'http://localhost:5000';
    var socket = socketClient(baseUrl);

    const navigate = useNavigate();
    // Get State from Redux Store
    const chatStore = useSelector((state) => state.chat);
    const channels = Object.keys(chatStore.workspaces[chatStore.activeWorkspace]['channels']);
    const { activeWorkspace, activeChannel, voiceClients, voiceJoinUserId, rtcSignalData, voiceLeaveUserId } = chatStore;


    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);

    // Get props from parent
    const { setDrawerVisible, setModalVisible, setModalType, handleSnackMessage } = props;

    // Local state
    const [workspaceAnchorEl, setworkspaceAnchorEl] = useState(null);
    const [channelAnchorEl, setChannelAnchorEl] = useState(null);
    const [memberChannelAnchorEl, setMemberChannelAnchorEl] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    // When user or active workspace changes, check if we are admin
    useEffect(() => {
        // Gets the status if we are admin of current workspace (allows us to change workspace settings)
        async function getAdmin() {
            let workspaceId = activeWorkspace.split('-')[1];
            await Axios.get(`/workspace/admin?workspaceId=${workspaceId}&userId=${user.userId}`).then((response) => {
                setIsAdmin(response.data.isAdmin);
            });

        }
        getAdmin();
    }, [activeWorkspace, user]);


    // Handle channel change, and closes drawer if on mobile view
    const handleChannelChange = (channel) => {
        dispatch(changeChannel(channel));
        if (typeof setDrawerVisible !== 'undefined') setDrawerVisible(false);
    };

    // Checks if only 1 channel, if so does not call callback to delete channel
    const handleChannelDelete = (callback) => {
        // if (channels.length === 1) {
        //     handleSnackMessage('Please delete the workspace if only 1 channel', false);
        // } else {
        //     callback();
        // }
        callback();
    };

    const handleChannelLeave = (callback) => {
        callback();
    }

    // Handles to show modal, and its type
    const handleModalShow = (modalType) => {
        setModalType(modalType);
        setModalVisible(true);
    };

    // Handles showing of Settings Menu
    const handleSettingsClick = (e, type) => {
        if (type === 'workspace') setworkspaceAnchorEl(e.currentTarget);
        else if (type === 'channel') setChannelAnchorEl(e.currentTarget);
    };

    // Handles showing of Settings Menu
    const handleMemberSettingsClick = (e, type) => {
        if (type === 'member-channel') setMemberChannelAnchorEl(e.currentTarget);
    };

    // Handles closing settings menu
    const handleClose = () => {
        setworkspaceAnchorEl(null);
        setChannelAnchorEl(null);
        setMemberChannelAnchorEl(null);
    };

    //  Signs the user out
    const handleSignOut = () => {
        const userId = user.userId;
        console.log("Logout user id ", userId)
        Axios.get(`/user/logout?userId=${userId}`).then(res => {
            if (res) {
                dispatch(signOut())
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate('/')

            }
        })
    }

    // Handles saving workspaceId to clipboard
    const handleSaveClipboard = (text) => {
        navigator.clipboard.writeText(text);
        handleSnackMessage(`workspace ID ${text} saved to clipboard`, false);
    };

    // Handles changing the view and calls callback function
    const handleChangeView = (view, callBack) => {
        dispatch(changeView(view));
        if (callBack !== undefined) callBack();
    };



    return (
        <div className="channels-container">
            <div className="title-workspace">
                {activeWorkspace.split('-')[0]}
                {isAdmin ? (
                    <Tooltip title="Workspace Settings" key="workspace-settings" placement="right">
                        <IconButton onClick={e => handleSettingsClick(e, 'workspace')}>
                            {' '}
                            <MoreVert className="workspace-settings" />{' '}
                        </IconButton>
                    </Tooltip>

                ) : null}
            </div>

            <List className="channel-list">
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore style={{ color: "#ccc" }} />}>
                        Channels
                    </AccordionSummary>

                    {channels.map((channel, i) => (
                        <Slide direction="right" in={true} timeout={200 * (i + 1)} key={channel + activeWorkspace}>
                            <ListItem
                                onClick={e => handleChannelChange(channel)}
                                button
                                className="channel-item"
                                id={`${channel.split('-')[0]}`}
                            >
                                <AccordionDetails>
                                    <Typography style={{ color: '#ccc' }} variant="body1">
                                        <i className="channel-hashtag">#</i>
                                        {channel.split('-')[0].toLowerCase()}
                                    </Typography>
                                </AccordionDetails>

                                {isAdmin ? (
                                    <Tooltip title="Channel Settings" key="channel-settings" placement="right">
                                        <IconButton onClick={e => handleSettingsClick(e, 'channel')}>
                                            {' '}
                                            <FiSettings className="channel-settings" />{''}
                                        </IconButton>
                                    </Tooltip>
                                ) :
                                    // <Tooltip title="Channel Settings" key="member-channel-settings" placement="right">
                                    //     <IconButton onClick={e => handleMemberSettingsClick(e, 'member-channel')}>
                                    //         {' '}
                                    //         <FiSettings className="channel-settings" />{''}
                                    //     </IconButton>
                                    // </Tooltip>
                                    null
                                }

                            </ListItem>
                        </Slide>
                    ))}
                </Accordion>


            </List>
            <br />
            <div className='channel-extra' onClick={() => handleModalShow('channel-create')}>
                <IoMdAdd className="channel-icon" />
                <p className="channel-extra-name">&nbsp; Add Channel</p>
            </div>

            <div className='channel-extra' onClick={() => handleModalShow('invite-people')}>
                <PersonAddOutlined className="channel-icon" />
                <p className="channel-extra-name">&nbsp; Invite Friend</p>
            </div>

            {/* <Button className="modal-button" onClick={handleSignOut}>Sign out</Button> */}
            <Menu
                id="workspace-settings-menu"
                anchorEl={workspaceAnchorEl}
                open={Boolean(workspaceAnchorEl)}
                onClick={handleClose}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleSaveClipboard(activeWorkspace.split('-')[1])}>
                    {' '}
                    Workspace Id - {activeWorkspace.split('-')[1]}{' '}
                </MenuItem>
                <MenuItem onClick={() => handleModalShow('workspace-rename')}> Change Workspace Name </MenuItem>
                <MenuItem onClick={() => handleModalShow('workspace-delete')}> Delete Workspace </MenuItem>
                <MenuItem onClick={() => handleModalShow('channel-create')}> Add Channel </MenuItem>
            </Menu>

            <Menu
                id="channel-settings-menu"
                anchorEl={channelAnchorEl}
                open={Boolean(channelAnchorEl)}
                onClick={handleClose}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleModalShow('channel-rename')}> Change Channel Name </MenuItem>
                <MenuItem onClick={() => handleChannelDelete(() => handleModalShow('channel-delete'))}>
                    {' '}
                    Delete Channel{' '}
                </MenuItem>

            </Menu>

            <Menu
                id="member-channel-settings-menu"
                anchorEl={memberChannelAnchorEl}
                open={Boolean(memberChannelAnchorEl)}
                onClick={handleClose}
                onClose={handleClose}
            >

                <MenuItem onClick={() => handleChannelLeave(() => handleModalShow('channel-leave'))}>
                    {' '}
                    Leave Channel{' '}
                </MenuItem>

            </Menu>
        </div >


    );
}
export default ChannelList;
