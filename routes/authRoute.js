const router = require('express').Router();

const { register, login, refresh, logout } = require('../controllers/userController');

router.post('/register', register);
router.get('/login', login);
router.get('/refresh-token', refresh);
router.get('/logout', logout);

module.exports = router;