const express = require('express');
const {getQuestions, createQuestion,editQuestion,deleteQuestion} = require('./questions-controller');
const { userMiddleware, adminMiddleware } = require('../../middlewares/auth-middleware');


const router = express.Router();

router.get('/', userMiddleware,getQuestions);
router.post('/', adminMiddleware,createQuestion);
router.put('/:id', adminMiddleware,editQuestion);
router.delete('/:id',adminMiddleware, deleteQuestion);

module.exports = router;