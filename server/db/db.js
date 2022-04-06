// const mysql = require('mysql2/promise');

// const db = mysql.createConnection({
//     user: "root",
//     host: "localhost",
//     password: "",
//     database: "slack_app",
// });


// module.exports = db;
const mysql = require('mysql');
let dotenv = require('dotenv');
let util = require('util');

// Env vars
dotenv.config();
const host = "localhost";
const user = "root";
const password = ""
const database = "slack_app";

// Setup Mysql
var db = mysql.createPool({
    host,
    user,
    password,
    database
});
db.query = util.promisify(db.query);
module.exports = db;