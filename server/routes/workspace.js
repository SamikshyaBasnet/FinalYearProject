let express = require('express');
const db = require('../db/db');
var nodemailer = require('nodemailer');
const utilsFunction = require('../utils/utils');
let router = express.Router();

// Route to create a workspace
// Expects -> workspace NAme
// Expects -> User Id

router.post('/workspace/create', (req, res) => {
    const workspace_name = req.query.workspace_name;
    const userId = req.query.userId;
    var current = new Date();
    const created_date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()} ${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;

    if (!workspace_name || !userId) {
        res.status(400).json({
            message: 'Invalid information provided.',
            created: false
        });
    } else {
        db.query(`SELECT * FROM workspaces WHERE workspace_name='${workspace_name}'`, (error, result) => {
            if (error) {
                res.status(400).send({
                    error: error
                });
            }
            if (result.length > 0) {
                return res.json({
                    created: false,
                    message: "The workspace name already exists please enter another name."
                })
            } else {
                const workspaceId = utilsFunction.getUniqueId('workspace');
                const channelId = utilsFunction.getUniqueId('channel');
                createWorkspace(workspaceId, workspace_name, channelId, userId, created_date);
                res.send({
                    workspace: workspace_name + '-' + workspaceId,
                    channel: 'general' + '-' + channelId,
                    created: true,
                    userId: userId,
                    message: `Workspace ${workspace_name} created successfully!`
                });
            }
        })

    }
});

function sendEmail(receiverEmail, senderUsername, workspaceName, workspaceId) {
    try {
        var receiverEmail = receiverEmail;
        var senderUsername = senderUsername;
        var workspaceName = workspaceName;
        var workspaceId = workspaceId;

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "localhost",
            requireTLS: true,
            port: 587,
            secure: false,
            auth: {
                user: 'slackappnoreply@gmail.com',
                pass: 'slackapp12@',
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        var mailOptions = {
            from: "slackappnoreply@gmail.com",
            to: receiverEmail,
            subject: 'Invitation to Join Team',
            html: `
            <div style="max-width:600px;margin:0 auto">
            <img width="120" height="36" style="margin-top:0;margin-right:0;margin-bottom:32px;margin-left:0px;padding-right:30px;padding-left:30px" src="https://ci5.googleusercontent.com/proxy/PBlVc5Sg5y0WN27ua10sSoG98X8nIiWdFuJfUxaStI73ZQchYRpxovYiOafw0_Z51ICgHh42cL68faARdxKC9MlmXQ0KIRzcI3C1T29jBpdch2zBHg9W7vKdki5Ggna6r308MRBrR3PpYgcsvBNFmw=s0-d-e1-ft#https://shawols.slack.com/x-p2669470084260-2652578352903-2669471625604/img/slack_logo_240.png" alt="" class="CToWUd">
            <h1 style="font-size:30px;padding-right:30px;padding-left:30px">Join your team on <span class="il">Slack</span></h1>
            <p style="font-size:17px;padding-right:30px;padding-left:30px"><strong>${senderUsername}</strong> 
             has invited you to use <span class="il">Slack</span> with them, in a workspace called <strong>${workspaceName}</strong>.
            </p>

            <div style="padding-right:30px;padding-left:30px;padding-bottom:30px">
            <h4 style="display:none">Workspace name: ${workspaceName}</h4>
            <table style="table-layout:fixed;border:1px solid #a0a0a2;border-radius:8px;padding:40px 0;margin-top:20px;width:100%;border-collapse:separate;text-align:center">
            <tbody>
            <tr>
            <td style="vertical-align:middle">
            <div style="margin:auto;height:38px;width:38px;min-width:38px;border-radius:4px;color:#ffffff;font-size:18px;line-height:38px;vertical-align:middle;text-align:center;background-color:#0576b9">S</div>
            <h3 style="font-weight:900;padding-top:10px;margin-bottom:7px;font-size:21px;font-size:21px;margin-bottom:2px;width:70%;margin:auto;text-align:center;margin-top:0">Shawols</h3>
            <h4 style="margin-bottom:2px;font-size:17px;margin-bottom:12px">
            <a style="white-space:nowrap;color:#717274;text-decoration:none!important">${workspaceName}.<span class="il">slack</span>.com</a>
            </h4>
            <table style="width:100%;text-align:center">
            <tbody>
            <tr style="width:100%">
            <td style="width:100%">
            <span style="display:inline-block;border-radius:4px;background-color:#611f69" class="m_-5661414453106287171button_link_wrapper m_-5661414453106287171plum">
            <a class="m_-5661414453106287171button_link m_-5661414453106287171plum" href="https://join.slack.com/t/shawols/invite/enQtMjY2MDUyNzQ0MzQzMC0wYmNkY2FjOTZjNWZkZGIxZTg5ZjRmZDcxYzY4MzYxMGU1MTFhYThhMjNlODg1ZDVjNTc0NzM2MjY2NWE3NmQ2?x=x-p2669470084260-2652578352903-2669471625604" style="border-top:13px solid;border-bottom:13px solid;border-right:24px solid;border-left:24px solid;border-color:#611f69;border-radius:4px;background-color:#611f69;color:#ffffff;font-size:16px;line-height:18px;word-break:break-word;display:inline-block;text-align:center;font-weight:900;text-decoration:none!important" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://join.slack.com/t/shawols/invite/enQtMjY2MDUyNzQ0MzQzMC0wYmNkY2FjOTZjNWZkZGIxZTg5ZjRmZDcxYzY4MzYxMGU1MTFhYThhMjNlODg1ZDVjNTc0NzM2MjY2NWE3NmQ2?x%3Dx-p2669470084260-2652578352903-2669471625604&amp;source=gmail&amp;ust=1647756193200000&amp;usg=AOvVaw0mCgOL0i2OovXe731-HCuN">
            Join Now
            </a>
            </span>
            </td>
            </tr>
            </tbody>
            </table>
            <div style="margin-top:16px;display:block;border-top:1px solid #e1e1e4;padding-top:16px;padding-bottom:16px;margin-left:24px;margin-right:24px;text-align:center"><h4 style="font-size:17px;font-weight:900">
           ${senderUsername} has already joined
            </h4>
            <img src="https://ci5.googleusercontent.com/proxy/uXst8cQrtaGT-NdH2AnO1hfxjw9Z_0D64reLPTrWQStPW7Gcqn-SIF-GLeBeGM1JcSnCcrFGX0FRMLE7BLPXjSX0lYBA-0L4AAmVOdqn7nuaKjU75OiGhbsfUGqJmBxRhc6tpYpl=s0-d-e1-ft#https://avatars.slack-edge.com/2021-10-29/2667268126003_a3820a30ea711bcd0693_72.png" height="40" width="40" style="height:40px;width:40px;border-radius:4px;margin-right:8px" alt="Profile picture of ${senderUsername}." title="Profile picture of ${senderUsername}." class="CToWUd"/>
            </div>
            </td>
            </tr>
            </tbody>
            </table>
            </div>
            <h1 style="font-size:24px;padding-right:30px;padding-left:30px">
            What is <span class="il">Slack</span>?
            </h1>
            <p style="font-size:17px;padding-right:30px;padding-left:30px"><span class="il">
            Slack
            </span> is a messaging app for teams, a place you can collaborate on projects and organize conversations — so you can work together, no matter where you are. 
           </p>
            </div>
            `

        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return 1
            } else {
                return 0
            }
        });
    } catch (error) {
        console.log("email not sent ", error);
    }

}

router.post('/workspace/invite', (req, res) => {
    const workspaceId = req.query.workspaceId;
    const receiverEmail = req.query.receiverEmail;

    const senderUsername = req.body.senderUsername;
    const workspaceName = req.body.workspaceName;
    //const senderEmail = req.body.senderEmail;

    if (!workspaceId || !receiverEmail) {
        res.status(400).json({
            message: 'Invalid information provided.',
            joined: false
        });
    } else {
        db.query(`SELECT users.email from users JOIN userworkspaces WHERE workspace_id = '${workspaceId}' AND users.email = '${receiverEmail}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else if (result.length > 0) {
                    res.json({
                        message: `This person is already a member!`,
                        invitationSend: false
                    });
                } else {
                    sendEmail(receiverEmail, senderUsername, workspaceName, workspaceId)

                    res.json({
                        message: `Invitation send.`,
                        invitationSend: true
                    });

                }
            }
        )
    }

})

// Route to join a workspace
// Expects -> workspace Id
// Expects -> User Id
router.post('/workspace/join', (req, res) => {
    const {
        workspaceId,
        userId
    } = req.query;
    if (!workspaceId || !userId) {
        res.status(400).json({
            message: 'Invalid information provided.',
            joined: false
        });
    } else {
        db.query(`SELECT * from userworkspaces WHERE user_id = '${userId}' AND workspace_id = '${workspaceId}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else if (result.length > 0) {
                    res.json({
                        message: `Already a member!`,
                        joined: true
                    });
                } else {
                    joinworkspace(workspaceId, userId);
                    res.json({
                        message: `workspace with ID ${workspaceId} Joined.`,
                        joined: true
                    });

                }
            }
        )
    }
});

// Route to rename a workspace
// Expects -> workspaceName
// Expects -> workspaceId
// Expects -> UserId
router.post('/workspace/rename', (req, res) => {
    const {
        workspaceName,
        workspaceId,
        userId
    } = req.query;

    if (!workspaceName || !workspaceId || !userId) {
        res.json({
            message: "Please enter the workspace name.",
            renamed: false
        });
    } else {
        db.query(`SELECT * from workspaceadmins WHERE admin_id = '${userId}' AND workspace_id = '${workspaceId}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else if (result.length > 0) {
                    renameworkspace(workspaceName, workspaceId);
                    res.status(200).json({
                        message: `workspace with ID : ${workspaceId} Renamed to ${workspaceName}`,
                        workspaceName: workspaceName,
                        workspaceId: workspaceId,
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

// Route to delete a workspace
// Expects -> workspaceId
// Expects -> UserId
router.delete('/workspace/delete', (req, res) => {
    const {
        workspaceId,
        userId
    } = req.query;
    if (!workspaceId || !userId) {
        res.status(400).json({
            message: 'Invalid Information.',
            deleted: false,
        });
    } else {

        db.query(`SELECT * from workspaceadmins WHERE admin_id = '${userId}' AND workspace_id = '${workspaceId}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else if (result.length > 0) {
                    deleteworkspace(workspaceId);
                    res.status(200).json({
                        message: `workspace with ID : ${workspaceId} deleted`,
                        workspaceId: workspaceId,
                        deleted: true,
                    });
                } else {
                    res.json({
                        message: "You are not authorized to delete the workspace!",
                        deleted: false,
                    });
                }
            }
        )
    }
});

// Route to get if user is admin
// Expects -> userId
// Expects -> workspaceId
// Returns true or false

router.get('/workspace/admin', (req, res) => {
    const {
        userId,
        workspaceId
    } = req.query;
    // Check params
    if (!userId || !workspaceId) {
        res.status(400).send('Invalid Information.');
    } else {
        db.query(`SELECT * from workspaceadmins WHERE admin_id = '${userId}' AND workspace_id = '${workspaceId}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    //  throw err;
                } else if (result.length > 0) {
                    res.json({
                        isAdmin: true,
                    });
                } else {
                    res.json({
                        isAdmin: false,
                    });
                }
            }
        )
    }
});

router.get('/workspace/allusers', (req, res) => {
    const workspaceId = req.query.workspaceId;

    // Check params
    if (!workspaceId) {
        res.status(400).json({
            message: 'Invalid Informations',
            workspaceId: workspaceId
        });
    } else {
        db.query(`SELECT DISTINCT users.username FROM userworkspaces
        JOIN users ON users.user_id = userworkspaces.user_id 
          WHERE userworkspaces.workspace_id = '${workspaceId}'`,
            (error, result) => {
                if (error) {
                    res.send({
                        error: error
                    });
                } else {

                    return res.send(result);
                }

            }
        );
    }
});


router.get('/workspace/activeusers', async (req, res) => {
    const workspaceId = req.query.workspaceId;
    // Check params
    if (!workspaceId) {
        res.status(400).json({
            message: 'Invalid Informations',
            workspaceId: workspaceId
        });
    } else {
        await db.query(`SELECT users.username FROM userworkspaces
        JOIN users ON users.user_id = userworkspaces.user_id 
          WHERE userworkspaces.workspace_id = '${workspaceId}' AND users.user_last_active > (NOW() - INTERVAL 5 MINUTE)`,
            (error, result) => {
                if (error) {
                    res.send({
                        error: error
                    });
                } else {
                    return res.send(result);
                }

            }
        );
    }
});


// Creates workspace and all intermediary join tables
const createWorkspace = (workspaceId, workspaceName, channelId, userId, created_date) => {
    db.query(
        `INSERT INTO workspaces (workspace_id, workspace_name, admin_id, created_date) VALUES ('${workspaceId}', '${workspaceName}', '${userId}','${created_date}')`
    );
    db.query(`INSERT INTO workspaceadmins (workspace_id, admin_id) VALUES ('${workspaceId}', '${userId}')`);
    db.query(`INSERT INTO userworkspaces (user_id, workspace_id) VALUES ('${userId}', '${workspaceId}')`);
    db.query(
        `INSERT INTO channels (channel_id, channel_name, workspace_id, created_date) VALUES ('${channelId}', 'general', '${workspaceId}', '${created_date}')`
    );
};

// Joins workspace and returns the workspace name
const joinworkspace = (workspaceId, userId) => {
    db.query(`INSERT INTO userworkspaces (workspace_id, user_id) VALUES ('${workspaceId}', '${userId}')`);
    return db.query(`SELECT workspace_name FROM workspaces WHERE workspace_id = '${workspaceId}'`);
};

// Renames a workspace
const renameworkspace = (workspaceName, workspaceId) => {
    return db.query(
        `UPDATE workspaces SET workspace_name = '${workspaceName}' WHERE workspace_id = '${workspaceId}'`
    );
};

// Deletes a workspace
const deleteworkspace = (workspaceId) => {
    db.query(`DELETE FROM workspaces where workspace_id = '${workspaceId}'`);
    db.query(`DELETE FROM userworkspaces where workspace_id = '${workspaceId}'`);
    db.query(`DELETE FROM workspaceadmins where workspace_id = '${workspaceId}'`);
    db.query(`DELETE FROM channels where workspace_id = '${workspaceId}'`);
};


module.exports = router;