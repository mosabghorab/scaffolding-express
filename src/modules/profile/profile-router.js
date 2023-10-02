const express = require('express');
const {edit,my} = require('./profile-controller');

const router = express.Router();

router.put('/edit',edit);
router.get('/my',my);

module.exports = router;