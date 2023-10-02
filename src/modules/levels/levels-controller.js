const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { createLevelValidator, editLevelValidator } = require("./validators");
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');
const { object } = require('joi');


// create level.
const createLevel = async (req, res) => {
    let dto = {
        courseId: req.body.courseId,
        title: req.body.title,
        description: req.body.description,
        levelNumber: req.body.levelNumber,
        image: req.files?.image,
    }
    // auto validators.
    const result = createLevelValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK,).json(response.toJson());
    }
    const image = dto.image;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'level-' + uniqueSuffix + '.' +image.name.split('.')[1];
    uploadFile(`levels/${filename}`, image.data, async (url) => {
        console.log('file uploaded successfully');
        const level = await db.levels.create({
            courseId: req.body.courseId,
            title: req.body.title,
            description: req.body.description,
            levelNumber: req.body.levelNumber,
            image: url,
        });
        const response = new Response(true, 'تم انشاء المستوى بنجاح', level);
        return res.status(StatusCodes.OK).json(response.toJson());
    }, () => {
        console.log('failed to upload the file');
        const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
        return res.status(StatusCodes.OK).json(response.toJson());
    });
}


// edit level.
const editLevel = async (req, res) => {
    const levelId = req.params.id;
    if (req.files && req.files.image) {
        let dto = {
            title: req.body.title,
            description: req.body.description,
            levelNumber: req.body.levelNumber,
            image: req.files?.image,
        }
        // auto validators.
        const result = editLevelValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const levelToUpdate = await db.levels.findOne({
            where: {
                id: levelId,
            },
        });
        // delete old image.
        deleteFile('levels', levelToUpdate.image, () => {
            // upload new image.
            const image = dto.image;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = 'level-' + uniqueSuffix + '.' +image.name.split('.')[1];
            uploadFile(`levels/${filename}`, image.data, async (url) => {
                console.log('file uploaded successfully');
                // edit level in db.
                const editResult = await db.levels.update({
                    title: dto.title,
                    description: dto.description,
                    levelNumber: dto.levelNumber,
                    image: url,
                }, {
                    where: {
                        id: levelId,
                    },
                });
                if (editResult == 0) {
                    const response = new Response(false, 'فشل عملية التعديل');
                    return res.status(StatusCodes.OK).json(response.toJson());
                }
                const level = await db.levels.findOne({
                    where: {
                        id: levelId
                    }
                });
                const response = new Response(true, 'تم تعديل المستوى بنجاح', level);
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
            levelNumber: req.body.levelNumber,
        }
        // auto validators.
        const result = editLevelValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const editResult = await db.levels.update(dto, {
            where: {
                id: levelId,
            },
        });
        if (editResult == 0) {
            const response = new Response(false, 'فشل عملية التعديل');
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const level = await db.levels.findOne({
            where: {
                id: levelId
            }
        });
        const response = new Response(true, 'تم تعديل المستوى بنجاح', level);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// get levels.
const getLevels = async (req, res) => {
    const levels = await db.levels.findAll({
        where: {
            courseId: req.query.courseId,
        },
        order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع المستويات', levels);
    return res.status(StatusCodes.OK).json(response.toJson());
}


// show level.
const showLevel = async (req, res) => {
    const level = await db.levels.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!level) {
        const response = new Response(false, 'المستوى غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const lessons = await db.lessons.findAll({
        where:{
            levelId:level.id,
        },
        attributes: ['id','title'],
    });
    level.setDataValue('lessons',lessons);
    const response = new Response(true, 'تفاصيل المستوى', level);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// delete level.
const deleteLevel = async (req, res) => {
    const level = await db.levels.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!level) {
        const response = new Response(false, 'المستوى غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    deleteFile('levels', level.image, async () => {
        await db.levels.destroy({
            where: {
                id: req.params.id,
            },
        });
        const response = new Response(true, 'تم حذف المستوى بنجاح');
        return res.status(StatusCodes.OK).json(response.toJson());
    }, (error) => {
        console.log(error);
        const response = new Response(false, 'حدث خطأ اثناء حذف الملف');
        return res.status(StatusCodes.OK).json(response.toJson());
    });
}


module.exports = {
    getLevels,
    showLevel,
    createLevel,
    editLevel,
    deleteLevel
}