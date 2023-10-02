const express = require('express');
const {getLevels,showLevel, createLevel,editLevel,deleteLevel} = require('./levels-controller');
const { userMiddleware, adminMiddleware } = require('../../middlewares/auth-middleware');

const router = express.Router();

router.get('/',getLevels);
router.post('/', adminMiddleware,createLevel);
router.get('/:id',showLevel);
router.put('/:id', adminMiddleware,editLevel);
router.delete('/:id', adminMiddleware,deleteLevel);

module.exports = router;