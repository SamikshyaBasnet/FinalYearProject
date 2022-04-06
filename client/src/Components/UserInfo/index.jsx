import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, makeStyles, TextField } from '@material-ui/core';
import { sendPrivateMessage, changeView, changePMUser } from '../../actions';

const useStyle = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: 250,
    background: '#360936'
  },
  cardHeader: {
    background: '#360936',
    width: '100%',
    display: 'flex',
    height: '100px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: '1em',
    marginBottom: '8px'
  },
  cardInput: {
    padding: '1em'
  },
  input: {
    height: '38px'
  }
}));

export default function UserInfo(props) {

  // Get state from redux store
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const { userName, setUserInfoVisible } = props;
  const classes = useStyle();
  const [messageText, setMessageText] = useState('');

  // Handles keypress and calls the callback method
  const handleKeyPress = (e, callbackMethod) => {
    if (e.key === "Enter") {
      callbackMethod();
    }
  }

  // Calls API to send a Private message
  const handleSendPrivateMessage = (messageText, userName) => {
    const msg = { "from": user.userName, "msg": messageText, "to": userName };
    const pm = dispatch(sendPrivateMessage(msg));
    console.log("pmm", pm)
    dispatch(changeView('home'));
    dispatch(changePMUser(msg.to.toLowerCase()));
    setUserInfoVisible(false);
  }

  return (
    <Card className={classes.card}>
      <div className={classes.cardHeader}>
        <p className="user-profile user">
          {userName.charAt(0).toUpperCase()}
        </p>
        <Typography variant='body1' gutterBottom>{userName}</Typography>
      </div>
      <div className={classes.cardInput}>
        <TextField
          id="user-private-message"
          label={`Private message`}
          placeholder={`Send Message @${userName}`}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, () => handleSendPrivateMessage(messageText, userName))}
          variant="standard"
          InputProps={{
            className: classes.input
          }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
    </Card>
  )
}
