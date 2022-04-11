let express = require('express');
const db = require('../db/db');

const utilsFunction = require('../utils/utils');


let router = express.Router();

// Route to create a channel
// Expects -> Channel Name
// Expects -> workspace Id
// Expects -> User Id
router.post('/channel/create', (req, res) => {
    // Check if params exist
    console.log("Called");
    const channelName = req.query.channelName;
    const workspace = req.query.workspace;
    const userId = req.query.userId;

    var current = new Date();
    const created_date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;


    const workspaceName = workspace.split('0')[0];
    const workspaceId = workspace.split('-')[1];

    if (!channelName || !workspace || !userId) {
        res.json({
            created: false,
            message: "Please enter the channel name."
        });
    } else {
        // Check if user exists
        db.query(`SELECT * from workspaceadmins WHERE admin_id = '${userId}' AND workspace_id = '${workspaceId}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else if (result.length > 0) {
                    db.query(`SELECT COUNT(*) FROM channels GROUP BY workspace_id, channel_name HAVING channel_name='${channelName}'`, (error, result) => {
                        if (error) {
                            res.status(400).send({
                                error: error
                            });
                        }
                        // console.log("already exist?", result);
                        if (result.length > 0) {
                            return res.json({
                                created: false,
                                message: "The channel name already exists please enter another name."
                            })
                        } else {
                            const channelId = utilsFunction.getUniqueId('channel');
                            createChannel(channelId, channelName, workspaceId, created_date);
                            res.status(200).json({
                                created: true,
                                channel: channelName + '-' + channelId,
                                workspace: workspaceName,
                                channelId: channelId
                            });
                        }
                    })
                } else {
                    res.status(401).send("You are not auhtorized to create the channel!");
                }
            }
        )
    }
});

// Route to rename a channel
// Expects -> Channel Name
// Expects -> Channel Id
// Expects -> Userid
router.post('/channel/rename', (req, res) => {
    const {
        channelName,
        channelId,
        workspaceId,
        userId
    } = req.query;
    if (!channelName) {
        res.json({
            message: "Please enter the channel name.",
            renamed: false
        });
    } else {
        // Check if user admin
        db.query(`SELECT * from workspaceadmins WHERE admin_id = '${userId}' AND workspace_id = '${workspaceId}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else if (result.length > 0) {
                    renameChannel(channelName, channelId);
                    res.status(200).json({
                        message: `Renamed to ${channelName} successfully!`,
                        channelName: channelName,
                        channelId: channelId,
                        renamed: true
                    });
                } else {
                    res.status(401).josn({
                        message: "You are not auhtorized to rename the channel!",
                        renamed: false
                    });
                }
            }
        )

    }
});

// Route to delete a channel
// Expects -> ChannelId
// Expects -> UserId
router.delete('/channel/delete', (req, res) => {
    const {
        channelId,
        workspaceId,
        userId,
    } = req.query;
    if (!channelId || !userId) {
        res.status(400).json({
            message: 'Invalid Params',
            deleted: false,
        });
    } else {
        // Check if user admin
        db.query(`SELECT * from workspaceadmins WHERE admin_id = '${userId}' AND workspace_id = '${workspaceId}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else if (result.length > 0) {
                    deleteChannel(channelId);
                    res.status(200).json({
                        message: `Channel deleted successfully!`,
                        channelId: channelId,
                        deleted: true,
                    });
                } else {
                    res.json({
                        message: "You are not authorized to rename the delete channel!",
                        deleted: false,
                    });
                }
            }
        )
    }
});

router.post('/message/pin', (req, res) => {
    const {
        message,
    } = req.query;

    // Check if user admin
    db.query(`UPDATE messages SET ispinned = 1 WHERE message='${message}'`,
        (err, result) => {
            if (err) {
                throw err
            } else {
                res.json({
                    isPinned: true,
                    message: message,
                })

            }
        }
    )
});

router.post('/message/unpin', (req, res) => {
    const {
        message,
    } = req.query;

    // Check if user admin
    db.query(`UPDATE messages SET ispinned = 0 WHERE message='${message}'`,
        (err, result) => {
            if (err) {
                throw err
            } else {
                res.json({
                    isUnPinned: true,
                    message: message,
                })

            }
        }
    )
});


router.get('/channel/pinnedmessage', async (req, res) => {

    const channelId = req.query.channelId;
    await db.query(`SELECT username, date, message from messages 
    WHERE channel_id='${channelId}' AND ispinned='1'`,
        (err, result) => {
            if (err) {
                throw err
            } else {
                res.send(result);
            }
        }
    )
});
// Create channel and all intermediary tables
const createChannel = (channelId, channelName, workspaceId, created_date) => {
    db.query(
        `INSERT INTO channels (channel_id, channel_name, workspace_id, created_date) VALUES ('${channelId}','${channelName}', '${workspaceId}', '${created_date}')`
    );
};

// rename a channel
const renameChannel = (channelName, channelId) => {
    db.query(
        `UPDATE channels SET channel_name = '${channelName}' WHERE channel_id = '${channelId}'`
    );
};

const deleteChannel = (channelId) => {
    db.query(`DELETE FROM channels WHERE channel_id = '${channelId}'`);
};

module.exports = router;