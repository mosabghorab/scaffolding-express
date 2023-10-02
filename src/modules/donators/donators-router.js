const express = require('express');
const { userMiddleware, adminMiddleware, authIfExistMiddleware } = require('../../middlewares/auth-middleware');

const {
    getDonators,
    createDonator,
    editDonator,
    deleteDonator
} = require('./donators-controller');

const router = express.Router();

router.get('/', getDonators);
router.post('/', adminMiddleware,createDonator);
router.put('/:id', adminMiddleware,editDonator);
router.delete('/:id', adminMiddleware,deleteDonator);

module.exports = router;