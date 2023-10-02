const express = require('express');
const {
    saveQuiz,getSavedQuizes
} = require('./quizes-controller');

const router = express.Router();

router.post('/save-quiz', saveQuiz);
router.get('/get-saved-quizes', getSavedQuizes);

module.exports = router;