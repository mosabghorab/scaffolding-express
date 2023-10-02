const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { createLessonValidator, editLessonValidator } = require("./validators");
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');


// create lesson.
const createLesson = async (req, res) => {
    let dto = {
        levelId: req.body.levelId,
        title: req.body.title,
        description: req.body.description,
        video: req.files?.video,
        // resource: req.body.resource,
    }
    // auto validators.
    const result = createLessonValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const video = dto.video;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'lesson-' + uniqueSuffix + '.' +video.name.split('.')[1];
    uploadFile(`lessons/${filename}`, video.data, async (url) => {
        console.log('file uploaded successfully');
        const lesson = await db.lessons.create({
            levelId: dto.levelId,
            title: dto.title,
            description: dto.description,
            video: url,
        });
        const response = new Response(true, 'تم انشاء الدرس بنجاح', lesson);
        return res.status(StatusCodes.OK).json(response.toJson());
    }, () => {
        console.log('failed to upload the file');
        const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
        return res.status(StatusCodes.OK).json(response.toJson());
    });
}


// edit lesson.
const editLesson = async (req, res) => {
    const lessonId = req.params.id;
    if (req.files && req.files.video) {
        let dto = {
            title: req.body.title,
            description: req.body.description,
            video: req.files?.video,
             // resource: req.body.resource,
        }
        // auto validators.
        const result = editLessonValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const lessonToUpdate = await db.lessons.findOne({
            where: {
                id: lessonId,
            },
        });
         // delete old video.
         deleteFile('lessons', lessonToUpdate.video, () => {
            // upload new video.
            const video = dto.video;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = 'lesson-' + uniqueSuffix + '.' +video.name.split('.')[1];
            uploadFile(`lessons/${filename}`, video.data, async (url) => {
                console.log('file uploaded successfully');
                // edit lesson in db.
                const editResult = await db.lessons.update({
                    title: dto.title,
                    description: dto.description,
                    video: url,
                }, {
                    where: {
                        id: lessonId,
                    },
                });
                if (editResult == 0) {
                    const response = new Response(false, 'فشل عملية التعديل');
                    return res.status(StatusCodes.OK).json(response.toJson());
                }
                const lesson = await db.lessons.findOne({
                    where: {
                        id: lessonId
                    }
                });
                const response = new Response(true, 'تم تعديل الدرس بنجاح', lesson);
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
        const result = editLessonValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const editResult = await db.lessons.update(dto, {
            where: {
                id: lessonId,
            },
        });
        if (editResult == 0) {
            const response = new Response(false, 'فشل عملية التعديل');
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const lesson = await db.lessons.findOne({
            where: {
                id: lessonId
            }
        });
        const response = new Response(true, 'تم تعديل الدرس بنجاح', lesson);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// get lessons.
const getLessons = async (req, res) => {
    const lessons = await db.lessons.findAll({
        where: {
            levelId: req.query.levelId,
        },
        order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع الدروس', lessons);
    return res.status(StatusCodes.OK).json(response.toJson());
}


// show lesson.
const showLesson = async (req, res) => {
    const lesson = await db.lessons.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!lesson) {
        const response = new Response(false, 'الدرس غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const response = new Response(true, 'تفاصيل الدرس', lesson);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// delete lesson.
const deleteLesson = async (req, res) => {
    const lesson = await db.lessons.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!lesson) {
        const response = new Response(false, 'الدرس غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    deleteFile('lessons', lesson.video, async () => {
        await db.lessons.destroy({
            where: {
                id: req.params.id,
            },
        });
        const response = new Response(true, 'تم حذف الدرس بنجاح');
        return res.status(StatusCodes.OK).json(response.toJson());
    }, (error) => {
        console.log(error);
        const response = new Response(false, 'حدث خطأ اثناء حذف الملف');
        return res.status(StatusCodes.OK).json(response.toJson());
    });
}


module.exports = {
    getLessons,
    showLesson,
    createLesson,
    editLesson,
    deleteLesson
}