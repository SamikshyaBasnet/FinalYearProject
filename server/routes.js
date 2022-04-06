const router = require('express').Router();
const {
    register
} = require('./controllers/registerController');
const {
    login
} = require('./controllers/loginController');
// const {getUser} = require('./controllers/getUserController');

router.post('/register', register);

router.post('/login', login);

router.get('/login', loggedInData);

// router.get('/getuser', getUser);

module.exports = router;