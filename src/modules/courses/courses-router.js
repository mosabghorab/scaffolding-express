const express = require('express');
const { getCourses, showCourse, createCourse, editCourse, deleteCourse } = require('./course-controller');
const { userMiddleware, adminMiddleware ,authIfExistMiddleware} = require('../../middlewares/auth-middleware');

const router = express.Router();

router.get('/',getCourses);
router.post('/', adminMiddleware, createCourse);
router.get('/:id',authIfExistMiddleware,showCourse);
router.put('/:id', adminMiddleware, editCourse);
router.delete('/:id', adminMiddleware, deleteCourse);

module.exports = router;