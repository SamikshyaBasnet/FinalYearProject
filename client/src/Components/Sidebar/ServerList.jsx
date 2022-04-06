import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddCircleOutline, Home } from '@material-ui/icons';
import { List, Tooltip, IconButton } from '@material-ui/core';
import './Sidebar.css'
import { changeWorkspace, changeView, } from '../../actions';
//import { Overlay, Tooltip, Button, } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

export default function ServerList(props) {

    // Get State from Redux Store
    const Store = useSelector((state) => state.chat);
    const workspaces = Object.keys(Store.workspaces);

    const dispatch = useDispatch();

    // Get props from parent
    const { setModalVisible, setModalType } = props;

    // Handles server change, and closes drawer if on mobile view

    const handleWorkspaceChange = (workspace) => {
        dispatch(changeWorkspace(workspace));
    };

    // Handles to show modal, and its type
    const handleModalShow = () => {
        setModalType('workspace-create-join');
        setModalVisible(true);
    };

    // Handles changing the view and calls callback function
    const handleChangeView = (view, callBack) => {
        dispatch(changeView(view));
        if (callBack !== undefined) callBack();
    };

    //get all the user data
    const user = useSelector((state) => state.user);


    var randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    //console.log("random color ", randomColor);


    return (
        <div className="workspaces-container">
            <List className="workspace_list">
                <Tooltip title="Home" key="home" placement="right">
                    <IconButton className="home-icon"
                        onClick={() => handleChangeView('home')}>
                        <Home className="homeIcon" />
                    </IconButton>
                </Tooltip>

                {workspaces.map(workspace => (
                    <Tooltip title={workspace.split('-')[0]} key={workspace} placement="right" arrow>
                        <Button className="workspace_button"
                            onClick={() => handleChangeView('workspaces', () => handleWorkspaceChange(workspace))}

                        >
                            {workspace.charAt(0).toUpperCase()}
                        </Button>

                    </Tooltip>
                ))}

                <Tooltip title="Create Workspace" arrow key="create-workspace" placement="right">
                    <IconButton className="server-icon"
                        onClick={() => handleChangeView('workspaces', () => handleModalShow())}
                    >
                        <AddCircleOutline className="addIcon" />
                    </IconButton>
                </Tooltip>
            </List>


        </div>
    );
}
