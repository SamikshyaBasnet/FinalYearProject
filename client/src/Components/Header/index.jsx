
import React, { useState, useEffect } from 'react';
import '../../App.css';
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
import {
    SwipeableDrawer,
    Button,
    Modal,
    Box,
    Grid,
    TextField,
    Table,
    TableBody,

    TableCell, TableContainer, TableHead, TableRow, Paper

} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Axios from '../API/api';
import { useNavigate } from 'react-router-dom';
import {
    signOut,
    loadUserData,
    loadReminders,
} from '../../actions';
import Sidebar from '../Sidebar';
import ActiveUserList from '../ActiveUserList';
import { FcCalendar, FcAlarmClock } from 'react-icons/fc'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import SearchIcon from '@material-ui/icons/Search'
import AvatarPicker from "./AvatarPicker";



export default function Header() {

    // Get State from Redux Store
    const chatStore = useSelector((state) => state.chat);
    const { activeChannel, activePMUser, activeView } = chatStore;
    const user = useSelector((state) => state.user);
    const { userId } = useSelector((state) => state.user);
    let { reminders } = useSelector((state) => state.user);

    let allreminders = []
    allreminders = reminders;
    // allreminders.push(reminders);
    console.log("from store", allreminders)
    // Local state
    const [sideBarDrawerVisible, setSideBarDrawerVisible] = useState(false);
    const [userListDrawerVisible, setUserListDrawerVisible] = useState(false);
    const [title, setTitle] = useState('');

    const [userName, setUserName] = useState('');
    const [dateState, setDateState] = useState(new Date());
    const [name, setName] = useState('');
    const [body, setBody] = useState('');

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
    console.log("sele", selectedDate)

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
    const handleCreateReminderOpen = () => {
        setOpenCreateReminder(true)
    };
    const handleCreateReminderClose = () => {
        setOpenCreateReminder(false);
    };


    //avatar picker

    const [avatarImage, setAvatarImage] = useState();

    const handleImageChange = (imageFile) => {
        setAvatarImage(imageFile);
    };

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
        height: 400,

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
            <div>
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
                    disableBackdropClick
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
                                    //value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    variant="standard"
                                    autoComplete="on"
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
            </div>
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
    var user_name = user.username;
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
                            {/* <Slide direction={createDirection} in={createVisible} mountOnEnter unmountOnExit timeout={100}> */}

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
                {/* <div className="header__middle">
                    <input placeholder="Search" />
                    <SearchIcon className="search" />

                </div> */}
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
                                        {/* <p className="user">
                                            {user.userName.charAt(0).toUpperCase()}
                                        </p> */}
                                        <AvatarPicker
                                            handleChangeImage={handleImageChange}
                                            avatarImage={avatarImage}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <p>Display Name</p>
                                    <TextField id="outlined-basic" defaultValue={user_name} variant="standard" />
                                    {/* <p>{user.username}</p> */}
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

                            </Grid>

                            <ChildModal />
                        </Box>
                    </Modal>
                </div>
            </Toolbar>

        </AppBar >
    );
}
