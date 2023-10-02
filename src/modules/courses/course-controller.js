const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');
const { createCourseValidator, editCourseValidator } = require("./validators");



// create course.
const createCourse = async (req, res) => {
    let dto = {
        userId: req.userId,
        title: req.body.title,
        description: req.body.description,
        image: req.files?.image,
    }
    // auto validators.
    const result = createCourseValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const image = dto.image;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'course-' + uniqueSuffix + '.' +image.name.split('.')[1];
    uploadFile(`courses/${filename}`, image.data, async (url) => {
        console.log('file uploaded successfully');
        const course = await db.courses.create({
            userId: dto.userId,
            title: dto.title,
            description: dto.description,
            image: url,
        });
        const response = new Response(true, 'تم انشاء المساق بنجاح', course);
        return res.status(StatusCodes.OK).json(response.toJson());
    }, () => {
        console.log('failed to upload the file');
        const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
        return res.status(StatusCodes.OK).json(response.toJson());
    });
}

// edit course.
const editCourse = async (req, res) => {
    const courseId = req.params.id;
    if (req.files && req.files.image) {
        let dto = {
            title: req.body.title,
            description: req.body.description,
            image: req.files?.image,
        }
        // auto validators.
        const result = editCourseValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const courseToUpdate = await db.courses.findOne({
            where: {
                id: courseId,
            },
        });
        // delete old image.
        deleteFile('courses', courseToUpdate.image, () => {
            // upload new image.
            const image = dto.image;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = 'course-' + uniqueSuffix + '.' +image.name.split('.')[1];
            uploadFile(`courses/${filename}`, image.data, async (url) => {
                console.log('file uploaded successfully');
                // edit course in db.
                const editResult = await db.courses.update({
                    title: dto.title,
                    description: dto.description,
                    image: url,
                }, {
                    where: {
                        id: courseId,
                    },
                });
                if (editResult == 0) {
                    const response = new Response(false, 'فشل عملية التعديل');
                    return res.status(StatusCodes.OK).json(response.toJson());
                }
                const course = await db.courses.findOne({
                    where: {
                        id: courseId
                    }
                });
                const response = new Response(true, 'تم تعديل المساق بنجاح', course);
                return res.status(StatusCodes.OK).json(response.toJson());
            }, () => {
                console.log('failed to upload the file');
                const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
                return res.status(StatusCodes.OK).json(response.toJson());
            });
        }, (error) => {
            console.log(error);
            const response = new Response(false, 'حدث خطأ اثناء حذف الملف');
            return res.status(StatusCodes.OK).json(response.toJson());
        });
    } else {
        let dto = {
            title: req.body.title,
            description: req.body.description,
        }
        // auto validators.
        const result = editCourseValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const editResult = await db.courses.update(dto, {
            where: {
                id: courseId,
            },
        });
        if (editResult == 0) {
            const response = new Response(false, 'فشل عملية التعديل');
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const course = await db.courses.findOne({
            where: {
                id: courseId
            }
        });
        const response = new Response(true, 'تم تعديل المساق بنجاح', course);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// get courses.
const getCourses = async (req, res) => {
    const courses = await db.courses.findAll({
        order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع المساقات', courses);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// show course.
const showCourse = async (req, res) => {
    const course = await db.courses.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!course) {
        const response = new Response(false, 'المساق غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    console.log(req.role);
    if(req.role == "student"){
        const userCourse = await db.usersCourses.findOne({
            where: {
                courseId: course.id,
                userId: req.userId,
            },
        });
        course.setDataValue('isJoined', userCourse != null);
    }
    const response = new Response(true, 'تفاصيل المساق', course);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// delete course.
const deleteCourse = async (req, res) => {
    const course = await db.courses.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!course) {
        const response = new Response(false, 'المساق غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    deleteFile('courses', course.image, async () => {
        await db.courses.destroy({
            where: {
                id: req.params.id,
            },
        });
        const response = new Response(true, 'تم حذف المساق بنجاح');
        return res.status(StatusCodes.OK).json(response.toJson());
    }, (error) => {
        console.log(error);
        const response = new Response(false, 'حدث خطأ اثناء حذف الملف');
        return res.status(StatusCodes.OK).json(response.toJson());
    });
}


module.exports = {
    getCourses,
    showCourse,
    createCourse,
    editCourse,
    deleteCourse
}