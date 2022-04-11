let express = require('express');
const db = require('../db/db');

const utilsFunction = require('../utils/utils');


let router = express.Router();

router.get(`/reminders`, async (req, res) => {
    const userId = req.query.userId;

    await db.query(`SELECT Name, Body, Id, Date FROM reminders WHERE user_id='${userId}'`, (err, result) => {
        if (err) {
            throw err
        } else {

            return res.send(result);

        }

    })
});


router.post('/reminders/create', (req, res) => {
    const name = req.query.name;
    const body = req.query.body;
    const date = req.query.date;
    const userId = req.query.userId;

    if (!name || !body || !date) {
        res.json({
            created: false,
            message: "Please enter all details."
        });
    } else {
        const id = utilsFunction.getUniqueId('reminder');
        createReminder(id, userId, name, body, date);
        res.status(200).json({
            created: true,
            reminderId: id,
            name: name,
            body: body,
            date: date,
        });
    }

});

router.delete('/reminder/delete', (req, res) => {

    const id = req.query.id;
    if (!id) {
        res.status(400).json({
            message: 'Invalid Params',
            deleted: false,
        });
    } else {
        db.query(`SELECT * from reminders WHERE Id = '${id}'`,
            (err, result) => {
                if (err) {
                    res.status(400).send('Server error');
                    throw err;
                } else {
                    deleteReminder(id);
                    res.status(200).json({
                        message: `Reminder deleted successfully!`,
                        reminderId: id,
                        deleted: true,
                    });
                }
            }
        )
    }
});

const createReminder = (id, user_id, name, body, date) => {
    db.query(
        `INSERT INTO reminders (Id, user_id, Name, Body, Date) VALUES ('${id}', '${user_id}','${name}','${body}', '${date}')`
    );
};

const deleteReminder = (id) => {
    db.query(`DELETE FROM reminders WHERE Id='${id}'`);
};

module.exports = router;