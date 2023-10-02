const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { userJoinToCourseValidator } = require("./validators");
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');


// user join to course.
const userJoinToCourse = async (req, res) => {
    let dto = {
        userId: req.userId,
        courseId: req.body.courseId,
    }
    // auto validators.
    const result = userJoinToCourseValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    await db.usersCourses.create(dto);
    const response = new Response(true, 'تم انضمام الطالب بنجاح');
    return res.status(StatusCodes.OK).json(response.toJson());
}

// get user joined courses.
const getUserJoinedCourses = async (req, res) => {
    const userCourses = await db.usersCourses.findAll({
        where: {
            userId: req.userId,
        },
        include:[
            {
                model: db.courses,
            }
        ],
        order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع المساقات التي انضم اليها هذا الطالب', userCourses);
    return res.status(StatusCodes.OK).json(response.toJson());
}


module.exports = {
    userJoinToCourse,
    getUserJoinedCourses,
}