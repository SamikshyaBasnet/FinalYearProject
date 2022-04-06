

import React, { useState, useEffect } from 'react';
import '../../App.css';
import './Header.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
    SwipeableDrawer,
    Button,
    Modal,
    Box,
    Grid,
    TextField,

} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../API/api';
import { useNavigate } from 'react-router-dom';
import {
    signOut,
    loadUserData
} from '../../actions';
import Sidebar from '../Sidebar';
import ActiveUserList from '../ActiveUserList';
import { FcCalendar, FcAlarmClock } from 'react-icons/fc'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import SearchIcon from '@material-ui/icons/Search'


export default function Header() {

    // Get State from Redux Store
    const chatStore = useSelector((state) => state.chat);
    const { activeChannel, activePMUser, activeView } = chatStore;
    const user = useSelector((state) => state.user);
    const { userId } = useSelector((state) => state.user);
    // Local state
    const [sideBarDrawerVisible, setSideBarDrawerVisible] = useState(false);
    const [userListDrawerVisible, setUserListDrawerVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [createVisible, setCreateVisible] = useState(false);
    const [createDirection, setCreateDirection] = useState('left');
    const [userName, setUserName] = useState('');
    const [dateState, setDateState] = useState(new Date());
    useEffect(() => {
        setInterval(() => setDateState(new Date()), 30000);
    }, []);

    //
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false);
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: '#320635',
        boxShadow: 24,
        p: 4,

    };
    const handleRenameUserName = (userName) => {
        Axios.post(
            `/user/edit?userName=${userName}&userId=${userId}`
        ).then((response) => {
            if (response.data.renamed === true) {
                setUserName(userName)
                dispatch(loadUserData(user.userId))
                // handleSnackMessage(response.data.message, true);
            }
            else {
                // handleSnackMessage(response.data.message, false);
            }
        })



    };

    function ChildModal() {
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };

        return (
            <React.Fragment>
                <div className="d-flex justify-content-center py-2">
                    <Button
                        className="modal-button"
                        variant="contained"
                        color="primary" onClick={handleOpen}>Edit Profile
                    </Button>
                </div>

                <Modal
                    hideBackdrop
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style, width: 450 }}>
                        <Grid container spacing={3} justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                <Typography variant="h5" color="primary" align="center">
                                    Edit Profile
                                </Typography>
                            </Grid>
                            <Grid item xs={12} className="grid-textfield">
                                <Typography variant="body1" style={{ color: 'white' }} paragraph>
                                    {' '}
                                    Enter a new User Name
                                </Typography>

                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={true}
                                    required
                                    label="User Name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    margin="dense"
                                    variant="standard"
                                    autoComplete="off"
                                />
                            </Grid>
                            <Grid item xs={6} className="grid-button">
                                <Button
                                    className="modal-button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleRenameUserName(userName)}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                        <div className="d-flex justify-content-center py-5">
                            <Button
                                className="modal-button"
                                variant="contained"
                                color="primary"
                            //onClick={handleClose}
                            >
                                Close
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </React.Fragment>
        );
    }


    // On active view change change title
    useEffect(() => {
        if (activeView === 'workspaces') {
            setTitle(activeChannel.split('-')[0].toLowerCase());
        } else if (activeView === 'home') {
            setTitle(activePMUser);
        }
    }, [activeView, activePMUser, activeChannel]);

    const handleSignOut = () => {
        const userId = user.userId;
        console.log("Logout user id ", userId)
        Axios.get(`/user/logout?userId=${userId}`).then(res => {
            if (res) {
                dispatch(signOut())
                localStorage.removeItem("token")
                navigate('/')
            }
        })
    }
    return (
        <AppBar position="static" className="appbar header">
            <Toolbar className="navbar header">
                {/* <div className="header">
                    <div className="header__middle d-flex flex-row justify-content-center">
                        <SearchIcon />
                        <input placeholder="Search sawol" />
                    </div>

                    <div className="user-profile">
                        <p className="user">
                            {user.userName.charAt(0).toUpperCase()}
                        </p>
                    </div>
                </div> */}


                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    className="menu-burger-button"
                    onClick={() => setSideBarDrawerVisible(true)}
                >
                    <MenuIcon />
                </IconButton>
                <SwipeableDrawer
                    anchor="left"
                    open={sideBarDrawerVisible}
                    onClose={() => setSideBarDrawerVisible(false)}
                    onOpen={() => setSideBarDrawerVisible(true)}
                >
                    <Sidebar setDrawerVisible={setSideBarDrawerVisible} />
                </SwipeableDrawer>
                <SwipeableDrawer
                    anchor="right"
                    open={userListDrawerVisible}
                    onClose={() => setUserListDrawerVisible(false)}
                    onOpen={() => setUserListDrawerVisible(true)}
                >
                    <ActiveUserList />
                </SwipeableDrawer>
                {/* <Typography variant="h6">{title} </Typography> */}

                <div className="header__left">
                    <AccessTimeIcon />
                </div>
                <div className="header__middle">
                    <input placeholder="Search" />
                    <SearchIcon className="search" />

                </div>
                <div className="header__right">
                    <div className="user-profile" onClick={handleOpen}>
                        <p className="user">
                            {user.userName.charAt(0).toUpperCase()}
                        </p>
                    </div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            {/* <Slide direction={createDirection} in={createVisible} mountOnEnter unmountOnExit timeout={100}> */}
                            <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ color: "#fff" }}>
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
                                        {user.userName}
                                    </p>
                                </Grid>
                                <Grid item xs={12}>
                                    <p>Local Time</p>
                                    <div className="d-flex">
                                        <div>

                                            <p>
                                                <FcCalendar />
                                                {' '}
                                                {dateState.toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                                &nbsp;
                                                &nbsp;
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <FcAlarmClock />
                                                {' '}
                                                {dateState.toLocaleString('en-US', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <p>Email Address</p>
                                    <p>
                                        {user.email}
                                    </p>
                                </Grid>
                                {/* <Grid item xs={12} className="grid-button">
                                    <Button
                                        className="modal-button"
                                        variant="contained"
                                        color="primary"
                                       
                                    // onClick={() => handleCreateWorkspace(workspaceName, userId)}
                                    >
                                        Edit Profile
                                    </Button>
                                </Grid> */}
                            </Grid>
                            {/* </Slide> */}
                            <ChildModal />
                        </Box>
                    </Modal>
                </div>
            </Toolbar>

        </AppBar>
    );
}
