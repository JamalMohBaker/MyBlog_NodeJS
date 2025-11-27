const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth, guest } = require('../middleware/auth');

router.get('/register',guest,  authController.showRegister);
router.post('/register', guest,  authController.register);

router.get('/login', guest,  authController.showLogin);
router.post('/login', guest,  authController.login);

router.post('/logout', auth,  authController.logout);

module.exports = router;