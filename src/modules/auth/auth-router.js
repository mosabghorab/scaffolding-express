// ||... auth router ...||
const express = require('express');
const {login,register,sendVerificationCode,verifyCode} = require('../auth/auth-controller');

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.post('/send-verification-code.js',sendVerificationCode);
router.post('/verifyCode',verifyCode);

module.exports = router;