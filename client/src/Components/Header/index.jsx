
import React, { useState, useEffect } from 'react';
// import '../../App.css';
import './Header.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from '@material-ui/pickers';
import AvatarPicker from "./AvatarPicker";

import {
    SwipeableDrawer,
    Button,
    Modal,
    Box,
    Grid,
    TextField,
    Table,
    TableBody,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TableCell, TableContainer, TableHead, TableRow, Paper

} from '@material-ui/core';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../API/api';
import { useNavigate } from 'react-router-dom';
import {
    signOut,
    loadUserData,
    loadReminders,
    loadSearchedMessages,
    loadPrivateSearchedMessages,
    loadUserProfileData
} from '../../actions';
import Sidebar from '../Sidebar';
import ActiveUserList from '../ActiveUserList';
import { FcCalendar, FcAlarmClock } from 'react-icons/fc'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import SearchIcon from '@material-ui/icons/Search'

export default function Header() {

    // Get State from Redux Store
    const chatStore = useSelector((state) => state.chat);
    var { activeChannel, activePMUser, activeView, searchedMessages } = chatStore;
    const user = useSelector((state) => state.user);
    const { userId } = useSelector((state) => state.user);
    let { reminders } = useSelector((state) => state.user);
    const channelId = activeChannel.split('-')[1];

    let allreminders = []
    allreminders = reminders;
    // allreminders.push(reminders);

    // Local state
    const [sideBarDrawerVisible, setSideBarDrawerVisible] = useState(false);
    const [userListDrawerVisible, setUserListDrawerVisible] = useState(false);
    const [title, setTitle] = useState('');


    const [userName, setUserName] = useState(user.userName);
    const [dateState, setDateState] = useState(new Date());
    const [name, setName] = useState('');
    const [body, setBody] = useState('');
    //for profile
    const [avatarImage, setAvatarImage] = useState();

    const handleImageChange = (imageFile) => {
        setAvatarImage(imageFile);
    };

    //search messge
    const [searchMessage, setSearchMessage] = useState('');

    //to edit username
    const [isEditUsername, setIsEditUsername] = useState(false);

    //date pircker state
    let [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    useEffect(() => {
        setInterval(() => setDateState(new Date()), 30000);
    }, []);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadReminders(userId));

    }, [dispatch, user.userId]);


    selectedDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()} ${selectedDate.getHours()}:${selectedDate.getMinutes()}:${selectedDate.getSeconds()}`;


    const handleCreateReminder = (name, body, selectedDate) => {
        Axios.post(`/reminders/create?name=${name}&body=${body}&date=${selectedDate}&userId=${userId}`
        ).then((response) => {
            if (response.data.created === true) {
                console.log("create response=", response);
                setName('');
                setBody('');
                const reminder = { Name: name, Body: body, Date: selectedDate }
                console.log("create", reminder)
                dispatch(loadReminders(userId));
            }

        });

    }

    const handleDeleteReminder = (id) => {
        Axios.delete(
            `/reminder/delete?id=${id}`
        ).then((response) => {
            if (response.data.deleted === true) {
                dispatch(loadReminders(userId));
            }
        });
    }

    //
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [reminderOpen, setReminderOpen] = React.useState(false);
    const [openCreateReminder, setOpenCreateReminder] = useState(false);
    const [openSearchModal, setOpenSearchModal] = React.useState(false);


    const handleOpen = () => {
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleReminderOpen = () => {
        setReminderOpen(true)
    };
    const handleReminderClose = () => {
        setReminderOpen(false);
    };

    const handleSearchModalClose = () => {
        setOpenSearchModal(false);
    };

    const handleCreateReminderOpen = () => {
        setOpenCreateReminder(true)
    };
    const handleCreateReminderClose = () => {
        setOpenCreateReminder(false);
    };

    //searh message functionality

    // Handles changes in message box (catches enter to not send new lines. (Must send SHIFT+ENTER))
    function handleOnChange(e) {

        if (e.target.value !== '\n') setSearchMessage(e.target.value);

    }

    function handleKeyPress(e, searchMessage, channelId) {

        if (e.key === 'Enter' && !e.shiftKey) {

            if (activeView === "workspaces") {
                console.log("search pm");
                dispatch(loadSearchedMessages(searchMessage, channelId))

            }
            else if (activeView === "home") {
                console.log("search pm");
                dispatch(loadPrivateSearchedMessages(searchMessage))
            }
            setOpenSearchModal(true)
            setSearchMessage('');
        }


    }

    //  Signs the user out
    const handleSignOut = () => {
        const userId = user.userId;
        console.log("Logout user id ", userId)
        Axios.get(`/user/logout?userId=${userId}`).then(res => {
            if (res) {
                dispatch(signOut())
                localStorage.removeItem("token");
                localStorage.removeItem("userId")
                navigate('/')

            }
        })
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 750,
        color: "#fff !important",
        bgcolor: '#320635',
        boxShadow: 24,
        overflow: "scroll",
        p: 4,
        height: 500,

    };
    const handleRenameUserName = (userName) => {
        setIsEditUsername(!isEditUsername);
        Axios.post(
            `/user/usernameedit?userName=${userName}&userId=${userId}`
        ).then((response) => {
            if (response.data.renamed === true) {
                setUserName(userName)
                dispatch(loadUserData(user.userId));
                dispatch(loadUserProfileData(user.userId))

                // handleSnackMessage(response.data.message, true);
            }
            else {
                // handleSnackMessage(response.data.message, false);
            }
        })
    };



    // On active view change change title
    useEffect(() => {
        if (activeView === 'workspaces') {
            setTitle(activeChannel.split('-')[0].toLowerCase());
        } else if (activeView === 'home') {
            setTitle(activePMUser);
        }
    }, [activeView, activePMUser, activeChannel]);


    return (
        <AppBar position="static" className="appbar header">
            <Toolbar className="navbar header">
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
                    <AccessTimeIcon style={{ cursor: "pointer" }} onClick={handleReminderOpen} />
                    <Modal
                        open={reminderOpen}
                        onClose={handleReminderClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"

                    >
                        <Box sx={style}>
                            <Grid container spacing={3} justifyContent="center" alignItems="center" style={{ color: "#fff" }}>
                                <Grid item xs={12}>
                                    <Button className="modal-button" onClick={handleCreateReminderOpen}>{openCreateReminder ? "Close" : "Create"}</Button>
                                    <Modal
                                        open={openCreateReminder}
                                        onClose={handleCreateReminderClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style} style={{ width: "400px", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                            <Grid item xs={12}>
                                                <h3 style={{ color: "white" }}>Create Reminder</h3>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    error={true}
                                                    required
                                                    label="Title"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    variant="standard"
                                                    autoComplete="on"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    error={true}
                                                    required
                                                    label="Text"
                                                    value={body}
                                                    onChange={(e) => setBody(e.target.value)}
                                                    variant="standard"
                                                    autoComplete="on"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>

                                                    <KeyboardDateTimePicker
                                                        value={selectedDate}
                                                        onChange={handleDateChange}
                                                        label="Keyboard with error handler"
                                                        onError={console.log}
                                                        minDate={new Date("2018-01-01T00:00")}
                                                        format="yyyy-MM-dd hh:mm a"
                                                    />

                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button className="modal-button" onClick={() => handleCreateReminder(name, body, selectedDate)}>Save</Button>
                                            </Grid>
                                        </Box>
                                    </Modal>
                                </Grid>
                                {reminders.length === 0 ? (
                                    <div style={{
                                        width: "400px", display: "flex", justifyContent: "center", alignItems: "center"
                                    }}>
                                        You have no reminders right now.Click create to add new reminders.
                                    </div>
                                ) : <TableContainer component={Paper} style={{ overflowY: "scroll" }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow style={{ color: "#fff" }}>
                                                <TableCell align="right">Title</TableCell>
                                                <TableCell align="right">Description</TableCell>
                                                <TableCell align="right">Date & Time</TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {reminders.map((reminder, i) => (
                                                <TableRow
                                                    key={i}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="right">{reminder.Name}</TableCell>
                                                    <TableCell align="right">{reminder.Body}</TableCell>
                                                    <TableCell align="right">{reminder.Date}</TableCell>
                                                    <TableCell align="right"><Button className="modal-button" onClick={() => handleDeleteReminder(reminder.Id)}>Done</Button></TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>}

                            </Grid>

                        </Box>
                    </Modal>
                </div>
                <div className="header__middle">
                    <input placeholder="Search Message"
                        value={searchMessage}
                        onChange={e => handleOnChange(e)}
                        onKeyPress={e => handleKeyPress(e, searchMessage, channelId)}
                    />
                    <SearchIcon className="search" />

                    <Modal
                        open={openSearchModal}
                        onClose={handleSearchModalClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={{ ...style, width: 450 }}>
                            <div className="pinned_msg">
                                <h4>All the Messages</h4>
                                <div>
                                    {searchedMessages.length === 0 ? (
                                        <div style={{
                                            width: "400px", display: "flex", justifyContent: "center", alignItems: "center"
                                        }}>
                                            No messages Found!
                                        </div>
                                    ) :
                                        <div>
                                            {searchedMessages.map((msg, i) => {
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
                                                                </div>
                                                            }

                                                            secondary={msg.message}
                                                            className="message-text"
                                                        />

                                                    </ListItem>
                                                )

                                            })}
                                        </div>
                                    }

                                </div>
                            </div>
                        </Box>
                    </Modal>


                </div>
                <div className="header__right">
                    {user.profile === "" ?
                        <div className="user-profile" onClick={handleOpen}>
                            <p className="user">
                                {user.userName.charAt(0).toUpperCase()}

                            </p>
                        </div> :
                        <div onClick={handleOpen}>
                            <img className='user-profile-pic' src={`/uploads/${user.profile}`} alt="" height="20" width="20" />
                        </div>
                    }

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style} style={{ width: "350px", overflowY: "hidden" }}>
                            {/* <Slide direction={createDirection} in={createVisible} mountOnEnter unmountOnExit timeout={100}> */}
                            <Grid container spacing={3} style={{ color: "#fff" }}>
                                <Grid item xs={12}>
                                    <AvatarPicker
                                        handleChangeImage={handleImageChange}
                                        avatarImage={avatarImage}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <p>Display Name</p>
                                </Grid>
                                <Grid className="d-flex justify-content-start">
                                    <Grid className="mx-2" item xs={6}>

                                        <TextField id="outlined-basic" value={userName} disabled={isEditUsername ? false : true}
                                            onChange={(e) => setUserName(e.target.value)} variant="standard" />
                                        {/* <p>{user.username}</p> */}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            className="modal-button"
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleRenameUserName(userName)}>
                                            {isEditUsername ? "Save" : "Change"}
                                        </Button>
                                    </Grid>
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
                                <Grid item xs={12}>
                                    <Button className="modal-button" onClick={handleSignOut}>Sign out</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Modal>
                </div>
            </Toolbar>

        </AppBar >
    );
}
