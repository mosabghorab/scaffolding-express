const express = require('express');
const {
    getUsers,
    createUser,
    editUser,
    deleteUser
} = require('./users-controller');

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', editUser);
router.delete('/:id', deleteUser);

module.exports = router;