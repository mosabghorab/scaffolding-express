const express = require('express');
const {getLessons,showLesson,createLesson,editLesson,deleteLesson} = require('./lessons-controller');
const { userMiddleware, adminMiddleware } = require('../../middlewares/auth-middleware');

const router = express.Router();

router.get('/', userMiddleware,getLessons);
router.post('/', adminMiddleware,createLesson);
router.get('/:id', userMiddleware,showLesson);
router.put('/:id', adminMiddleware,editLesson);
router.delete('/:id', adminMiddleware,deleteLesson);

module.exports = router;