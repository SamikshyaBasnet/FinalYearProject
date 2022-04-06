import React, { useState, KeyboardEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Paper,
    Button,
    Card,
    CardContent,
    Typography,
    CardActionArea,
    CardMedia,
    Slide,
    TextField,
    Grid
} from '@material-ui/core';
import { GroupAdd, AddToQueue, Tune } from '@material-ui/icons';
import Axios from '../API/api';
import { createChannel, createWorkspace, updateActiveState } from '../../actions';
import '../Sidebar/Sidebar.css';
import '../../App.css';
import { moment } from 'moment';

export default function ActionsModal({ handleSnackMessage, modalType }) {

    // Get State from Redux Store
    const user = useSelector((state) => state.user);
    const userId = user.userId;

    const { activeWorkspace, activeChannel } = useSelector((state) => state.chat);
    const dispatch = useDispatch();

    // Get data from props
    // const { handleSnackMessage, modalType } = props;

    // Local state to control Modal Windows + Data fields
    const [mainVisible, setMainVisible] = useState(true);
    const [mainDirection, setMainDirection] = useState('left');
    const [createVisible, setCreateVisible] = useState(false);
    const [createDirection, setCreateDirection] = useState('left');
    const [joinVisible, setJoinVisible] = useState(false);
    const [joinDirection, setJoinDirection] = useState('left');
    const [workspaceName, setWorkspaceName] = useState('');
    const [workspaceId, setworkspaceId] = useState('');
    const [channelName, setChannelName] = useState('');
    const [receiverEmail, setReceiverEmail] = useState('');
    const [error, setError] = useState('');

    // Handles showing the Join workspace window
    const showhandleJoinWorkspace = () => {
        setMainDirection('right');
        setCreateDirection('left');
        setJoinVisible(true);
        setMainVisible(false);
    };

    // Handles showing the Create workspace window
    const showhandleCreateWorkspace = () => {
        setMainDirection('right');
        setJoinDirection('left');
        setCreateVisible(true);
        setMainVisible(false);
    };
    const current = new Date();
    const created_date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    // Method to handle creation of workspaces
    const handleCreateWorkspace = (workspaceName, userId) => {
        Axios.post(`/workspace/create?workspace_name=${workspaceName}&userId=${userId}`,
            { created_date: created_date }
        ).then((response) => {
            if (response.data.created === true) {
                console.log(response);
                dispatch(createWorkspace(response.data))
                handleSnackMessage(response.data.message, true);
            }
            else {
                console.log(response.data.message);
                handleSnackMessage(response.data.message, false);
            }
        });
    };

    // Method to handle joining of workspaces
    const handleJoinWorkspace = (workspaceId, userId) => {
        Axios.post(`/workspace/join?workspaceId=${workspaceId}&userId=${userId}`)
            .then((response) => {
                if (response.data.joined === true) {
                    console.log("Workspace rename", response);
                    handleSnackMessage(response.data.message, true);
                }
                else {
                    console.log(response.data.message);
                    handleSnackMessage(response.data.message, false);
                }
            })

    };

    const handleInviteFriend = (workspaceId, receiverEmail) => {

        //  var senderEmail = s
        var senderUsername = user.userName;
        var workspaceName = activeWorkspace.split('-')[0]

        Axios.post(`/workspace/invite?workspaceId=${workspaceId}&receiverEmail=${receiverEmail}`,
            { senderUsername: senderUsername, workspaceName: workspaceName }
        )
            .then((response) => {
                if (response.data.isInvited === true) {

                    handleSnackMessage(response.data.message, true);
                }
                else {
                    console.log(response.data.message);
                    handleSnackMessage(response.data.message, false);
                }
            })

    };

    // Method to handle renaming of workspaces
    const handleRenameWorkspace = (workspaceName, workspaceId) => {
        Axios.post(
            `/workspace/rename?workspaceName=${workspaceName}&workspaceId=${workspaceId}&userId=${userId}`
        ).then((response) => {
            if (response.data.renamed === true) {
                console.log("Workspace rename", response);
                handleSnackMessage(response.data.message, true);

            }
            else {

                console.log(response.data.message);
                handleSnackMessage(response.data.message, false);
            }
        });
    };

    // Method to handle deleting workspaces
    const handleDeleteWorkspace = (workspaceId, userId) => {
        Axios.delete(`/workspace/delete?workspaceId=${workspaceId}&userId=${userId}`).then((response) => {
            if (response.data.deleted === true) {
                handleSnackMessage(response.data.message, true);

            }
            else {
                handleSnackMessage(response.data.message, false);
            }
        });
    };

    // Method to handle creation of channels
    const handleCreateChannel = (channelName, workspace) => {

        if (channelName.length < 1) {

            setError({ channelName: "Please enter a Channel Name" })
        }
        else {
            Axios.post(`/channel/create?channelName=${channelName}&workspace=${workspace}&userId=${userId}`,
                { created_date: created_date }
            ).then((response) => {
                if (response.data.created === true) {
                    dispatch(createChannel(response.data));
                    const message = `channel ${response.data.channel.split('-')[0]} with ID ${response.data.channel.split(
                        '-'[1]
                    )} created`;
                    handleSnackMessage(message, false);
                    console.log("Response from channel create ", response);
                }
                else {
                    const message = response.data.message
                    handleSnackMessage(message, false);
                }
            });
        }

    };

    // Method to handle renaming of channels
    const handleRenameChannel = (channelName, channelId) => {
        Axios.post(
            `/channel/rename?channelName=${channelName}&channelId=${channelId}&workspaceId=${activeWorkspace.split('-')[1]
            }&userId=${userId}`
        ).then((response) => {
            if (response.data.renamed === true) {
                setChannelName(channelName)
                handleSnackMessage(response.data.message, true);
            }
            else {
                handleSnackMessage(response.data.message, false);
            }
        })

        //  

    };

    // Method to handle deleting of channels
    const handleDeleteChannel = (channelId) => {
        Axios.delete(
            `/channel/delete?channelId=${channelId}&workspaceId=${activeWorkspace.split('-')[1]}&userId=${userId}`
        ).then((response) => {
            if (response.data.deleted === true) {
                handleSnackMessage(response.data.message, true);
            }
            else {
                handleSnackMessage(response.data.message, false);
            }
        });
    };

    // Handles keypress and calls the callback method
    const handleKeyPress = (e, callbackMethod) => {
        if (e.key === 'Enter') {
            callbackMethod();
        }
    };

    const renderUserProfile = () => {
        return (
            <Slide direction={createDirection} in={createVisible} mountOnEnter unmountOnExit timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>

                        <div className="user-profile">
                            <p className="user">
                                {user.userName.charAt(0).toUpperCase()}
                            </p>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Display Name</p>
                        <p>
                            {user.userName.charAt(0).toUpperCase()}
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Local Time</p>
                        <p>
                            {`${moment.format('LLL')}`}
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        <p>Email Address</p>
                        <p>
                            {user.email}
                        </p>
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                        // onClick={() => handleCreateWorkspace(workspaceName, userId)}
                        >
                            Edit Profile
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    }

    // Renders the Main Modal Window with options to Create / Join workspace
    const renderMainWorkspace = () => {
        return (
            <Slide direction={mainDirection} in={mainVisible} timeout={100} mountOnEnter unmountOnExit>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Another workspace? Wow you're popular!
                        </Typography>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <Card className="grid-card">
                            <CardActionArea onClick={() => showhandleCreateWorkspace()}>
                                <CardContent>
                                    <Typography variant="h5" color="primary" gutterBottom>
                                        Create
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        Create a workspace and invite all your buddies.
                                    </Typography>
                                    <CardMedia>
                                        <AddToQueue className="modal-card-icon" />
                                    </CardMedia>
                                    <Button variant="contained" color="primary" className="modal-button">
                                        Create a workspace
                                    </Button>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <Card className="grid-card">
                            <CardActionArea onClick={() => showhandleJoinWorkspace()}>
                                <CardContent>
                                    <Typography variant="h5" color="secondary" gutterBottom>
                                        Join
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        Join a friends workspace and pwn some noobs!
                                    </Typography>
                                    <CardMedia>
                                        <GroupAdd className="modal-card-icon" />
                                    </CardMedia>
                                    <Button variant="contained" color="secondary" className="modal-button">
                                        Join a workspace
                                    </Button>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            </Slide>
        );
    };

    // Renders the workspace Create Modal Window
    const renderWorkspaceCreate = () => {
        return (
            <Slide direction={createDirection} in={createVisible} mountOnEnter unmountOnExit timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Create a workspace!
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-textfield">
                        <Typography variant="body1" paragraph>
                            {' '}
                            Enter a workspace Name to create a workspace and get access to unlimited chat channels!{' '}
                        </Typography>
                        <TextField
                            error={true}
                            required
                            id="create-workspace-field"
                            label="workspace Name"
                            value={workspaceName}
                            onChange={e => setWorkspaceName(e.target.value)}
                            onKeyPress={e => handleKeyPress(e, () => handleCreateWorkspace(workspaceName, userId))}
                            margin="dense"
                            variant="standard"
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            onClick={() => handleCreateWorkspace(workspaceName, userId)}
                        >
                            Create workspace
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    };

    // Renders the Channel Create Modal Window
    const renderInvitePeople = () => {

        let workspaceId = activeWorkspace.split('-')[1];

        return (
            <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Invite Friends
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-textfield">
                        <Typography variant="body1" paragraph>
                            {' '}
                            Enter your Friend Email to invite him/her to your team.
                        </Typography>
                        <TextField
                            required
                            id="invite-people-field"
                            label="Email Address"
                            value={receiverEmail}
                            error={true}
                            onChange={e => setReceiverEmail(e.target.value)}
                            onKeyPress={e => handleKeyPress(e, () => handleInviteFriend(receiverEmail, workspaceId))}
                            margin="dense"
                            variant="standard"
                            autoComplete="off"
                        />
                        {/* <p>{error}</p> */}
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            onClick={() => handleInviteFriend(receiverEmail, workspaceId)}
                        >
                            Invite
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    };

    // Renders a modal with an input
    const renderworkspaceRename = () => {
        return (
            <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Rename workspace
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-textfield">
                        <Typography variant="body1" paragraph>
                            {' '}
                            Enter a new workspace Name for workspace - {activeWorkspace.split('-')[0]}{' '}
                        </Typography>
                        <TextField
                            error={true}
                            required
                            id="create-channel-field"
                            label="Workspace Name"
                            value={workspaceName}

                            onChange={e => setWorkspaceName(e.target.value)}
                            onKeyPress={e => handleKeyPress(e, () => handleRenameWorkspace(workspaceName, activeWorkspace.split('-')[1]))}
                            margin="dense"
                            variant="standard"
                            autoComplete="off"
                            inputProps={{ style: { fontFamily: 'nunito', color: 'white !important' } }}
                        />
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            onClick={() => handleRenameWorkspace(workspaceName, activeWorkspace.split('-')[1])}
                        >
                            Rename workspace
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    };

    // Renders a modal to delete a workspace
    const renderworkspaceDelete = () => {
        return (
            <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Delete workspace
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-textfield">
                        <Typography variant="body1" paragraph>
                            {' '}
                            Are you sure you want to delete - {activeWorkspace.split('-')[0]}{' '}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: 'green', marginRight: '8px' }}
                            onClick={() => handleDeleteWorkspace(activeWorkspace.split('-')[1], userId)}
                        >
                            Yes
                        </Button>
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: 'red', marginLeft: '8px' }}
                            onClick={() => handleSnackMessage('Not deleting channel', false)}
                        >
                            No
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    };


    // Renders the workspace Join Modal Window
    const renderWorkspaceJoin = () => {
        return (
            <Slide direction={joinDirection} in={joinVisible} mountOnEnter unmountOnExit timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Join a workspace!
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-textfield">
                        <Typography variant="body1" paragraph>
                            {' '}
                            Enter a the workspace Id provided by your friend and start chatting right now!{' '}
                        </Typography>
                        <TextField
                            error={true}
                            required
                            id="join-workspace-field"
                            label="workspace Id"
                            value={workspaceId}
                            onChange={e => setworkspaceId(e.target.value)}
                            onKeyPress={e => handleKeyPress(e, () => handleJoinWorkspace(workspaceId, userId))}
                            margin="dense"
                            variant="standard"
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            onClick={() => handleJoinWorkspace(workspaceId, userId)}
                        >
                            Join workspace
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    };


    // Renders the Channel Create Modal Window
    const renderChannelCreate = () => {
        return (
            <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Create a Channel!
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-textfield">
                        <Typography variant="body1" paragraph>
                            {' '}
                            Enter a Channel Name for your new channel and start chatting right now!{' '}
                        </Typography>
                        <TextField
                            required
                            id="create-channel-field"
                            label="Channel Name"
                            value={channelName}
                            error={true}
                            onChange={e => setChannelName(e.target.value)}
                            onKeyPress={e => handleKeyPress(e, () => handleCreateChannel(channelName, activeWorkspace))}
                            margin="dense"
                            variant="standard"
                            autoComplete="off"
                        />
                        {/* <p>{error}</p> */}
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            onClick={() => handleCreateChannel(channelName, activeWorkspace)}
                        >
                            Create Channel
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    };

    // Renders a modal to rename a channel
    const renderChannelRename = () => {
        return (
            <Slide direction="left" in={true} timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Rename Chanel
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-textfield">
                        <Typography variant="body1" paragraph>
                            {' '}
                            Enter a new Channel Name for Channel - {activeChannel.split('-')[0]}{' '}
                        </Typography>
                        <TextField
                            error={true}
                            required
                            id="create-channel-field"
                            label="Channel Name"
                            value={channelName}
                            onChange={e => setChannelName(e.target.value)}
                            //  onKeyPress={e => handleKeyPress(e, () => handleRenameChannel(channelName, activeChannel.split('-')[1]))}
                            margin="dense"
                            variant="standard"
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            onClick={() => handleRenameChannel(channelName, activeChannel.split('-')[1])}
                        >
                            Rename Channel
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    };

    // Renders a modal to delete a channel
    const renderChannelDelete = () => {
        return (
            <Slide direction="left" in={true} mountOnEnter unmountOnExit timeout={100}>
                <Grid container spacing={3} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Typography variant="h5" color="primary" align="center">
                            Delete Channel
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-textfield">
                        <Typography variant="body1" paragraph>
                            {' '}
                            Are you sure you want to delete - {activeChannel.split('-')[0]}{' '}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="grid-button">
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: 'green', marginRight: '8px' }}
                            onClick={() => handleDeleteChannel(activeChannel.split('-')[1])}
                        >
                            Yes
                        </Button>
                        <Button
                            className="modal-button"
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: 'red', marginLeft: '8px' }}
                            onClick={() => handleSnackMessage('Not deleting channel', false)}
                        >
                            No
                        </Button>
                    </Grid>
                </Grid>
            </Slide>
        );
    };

    if (modalType === 'workspace-create-join')
        return (
            <Paper className="container-prompt">
                {renderMainWorkspace()}
                {renderWorkspaceCreate()}
                {renderWorkspaceJoin()}
            </Paper>
        );
    else if (modalType === 'invite-people') {
        return <Paper className="container-prompt">{renderInvitePeople()}</Paper>;
    }
    else if (modalType === 'user-profile') {
        return <Paper className="container-prompt">{renderUserProfile()}</Paper>;
    }
    else if (modalType === 'channel-create') {
        return <Paper className="container-prompt">{renderChannelCreate()}</Paper>;
    } else if (modalType === 'workspace-rename') {
        return <Paper className="container-prompt">{renderworkspaceRename()}</Paper>;
    } else if (modalType === 'channel-rename') {
        return <Paper className="container-prompt">{renderChannelRename()}</Paper>;
    } else if (modalType === 'channel-delete') {
        return <Paper className="container-prompt">{renderChannelDelete()}</Paper>;
    } else if (modalType === 'workspace-delete') {
        return <Paper className="container-prompt">{renderworkspaceDelete()}</Paper>;
    } else return null;
}
