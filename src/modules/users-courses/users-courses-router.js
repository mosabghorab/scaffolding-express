const express = require('express');
const {
    userJoinToCourse,getUserJoinedCourses
} = require('./users-courses-controller');

const router = express.Router();

router.post('/user-join-to-course', userJoinToCourse);
router.get('/user-joined-courses', getUserJoinedCourses);

module.exports = router;