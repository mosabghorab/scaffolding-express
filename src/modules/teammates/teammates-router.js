const express = require('express');
const { userMiddleware, adminMiddleware, authIfExistMiddleware } = require('../../middlewares/auth-middleware');

const {
    getTeammates,
    createTeammate,
    editTeammate,
    deleteTeammate
} = require('./teammates-controller');

const router = express.Router();

router.get('/', getTeammates);
router.post('/', adminMiddleware,createTeammate);
router.put('/:id', adminMiddleware,editTeammate);
router.delete('/:id', adminMiddleware,deleteTeammate);

module.exports = router;