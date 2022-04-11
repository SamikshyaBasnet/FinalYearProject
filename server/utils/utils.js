const db = require('../db/db');

// Returns true if user exists in DB, false if not
const userExists = (userId) => {
    const sqlQuery = `SELECT * FROM users WHERE user_id = '${userId}'`;
    let response = db.query(sqlQuery);
    if (response.length > 0) return true;
    else return false;
};

const workspaceExists = (workspace_name) => {
    // const sqlQuery = ;
    // let response = db.query(sqlQuery);
    // if (response.length > 0) return true;
    // else return false;
    db.query(`SELECT * FROM workspaces WHERE workspace_name='${workspace_name}'`, (error, result) => {
        if (error) {
            res.status(400).send({
                error: error
            });
        }
        if (result.length > 0) {
            return true
        } else {
            return false
        }

    })
};

const userIsAdmin = (userId, workspaceId) => {
    const sqlQuery = `SELECT * from workspaceadmins WHERE admin_id = '${userId}' AND workspace_id = '${workspaceId}'`;
    const response = db.query(sqlQuery);
    console.log("userId ", userId);
    console.log("workspaceId ", workspaceId);

    if (response.length > 0) return true;
    else return false;
};

// Gets a workspace Id and checks if it is unique in DB
getUniqueId = (type) => {

    const id = generateId();
    let sqlQuery = '';
    if (type === 'workspace') sqlQuery = `SELECT * FROM workspaces WHERE workspace_id = '${id}'`;
    else if (type === 'channel') sqlQuery = `SELECT * FROM channels WHERE channel_id = '${id}'`;
    else if (type === 'user') sqlQuery = `SELECT * FROM users WHERE user_id = '${id}'`;
    else if (type === 'reminder') sqlQuery = `SELECT * FROM reminders WHERE Id= '${id}'`;
    let response = db.query(sqlQuery);

    if (response.length > 0) {
        return getUniqueId(type);
    } else return id;
};

// Generates a hexdecimal 10 character ''
const generateId = () => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

module.exports = {
    userExists,
    userIsAdmin,
    getUniqueId,
    workspaceExists,
};