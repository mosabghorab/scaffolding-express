// ||... auth router ...||
const express = require('express');
const {getStatistics} = require('../_app/app-controller');

const router = express.Router();

router.get('/statistics',getStatistics);

module.exports = router;