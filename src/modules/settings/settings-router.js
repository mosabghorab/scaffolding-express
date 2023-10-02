const express = require('express');
const { userMiddleware, adminMiddleware, authIfExistMiddleware } = require('../../middlewares/auth-middleware');

const {
    saveSetting,
    getSetting,
} = require('./settings-controller');

const router = express.Router();

router.get('/', getSetting);
router.post('/', adminMiddleware,saveSetting);

module.exports = router;