const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { createTeammateValidator, editTeammateValidator } = require("./validators");
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');


// create teammate.
const createTeammate = async (req, res) => {
    let dto = {
        name: req.body.name,
        description: req.body.description,
        image: req.files?.image,
    }
    // auto validators.
    const result = createTeammateValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    if (dto.image) {
        const image = dto.image;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'teammate-' + uniqueSuffix + '.' + image.name.split('.')[1];
        uploadFile(`teammates/${filename}`, image.data, async (url) => {
            console.log('file uploaded successfully');
            const teammate = await db.teammates.create({
                name: dto.name,
                description: dto.description,
                image: url,
            });
            const response = new Response(true, 'تم انشاء عضو فريق العمل بنجاح', teammate);
            return res.status(StatusCodes.OK).json(response.toJson());
        }, () => {
            console.log('failed to upload the file');
            const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
            return res.status(StatusCodes.OK).json(response.toJson());
        });
    } else {
        const teammate = await db.teammates.create(dto);
        const response = new Response(true, 'تم اضافة عضو فريق بنجاح', teammate);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// edit teammate.
const editTeammate = async (req, res) => {
    const teammateId = req.params.id;
    if (req.files && req.files.image) {
        let dto = {
            name: req.body.name,
            description: req.body.description,
            image: req.files.image,
        }
        // auto validators.
        const result = editTeammateValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const teammateToUpdate = await db.teammates.findOne({
            where: {
                id: teammateId,
            },
        });
        const image = dto.image;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'teammate-' + uniqueSuffix + '.' + image.name.split('.')[1];
        // delete old image.
        deleteFile('teammates', teammateToUpdate.image, () => {
            // upload new image.
            uploadFile(`teammates/${filename}`, image.data, async (url) => {
                console.log('file uploaded successfully');
                // edit teammate in db.
                const editResult = await db.teammates.update({
                    name: dto.name,
                    description: dto.description,
                    image: url,
                }, {
                    where: {
                        id: teammateId,
                    },
                });
                if (editResult == 0) {
                    const response = new Response(false, 'فشل عملية التعديل');
                    return res.status(StatusCodes.OK).json(response.toJson());
                }
                const teammate = await db.teammates.findOne({
                    where: {
                        id: teammateId
                    },
                });
                const response = new Response(true, 'تم تعديل بيانات عضو الفريق بنجاح', teammate);
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
            name: req.body.name,
            description: req.body.description,
        }
        // auto validators.
        const result = editTeammateValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const editResult = await db.teammates.update(dto, {
            where: {
                id: teammateId,
            },
        });
        if (editResult == 0) {
            const response = new Response(false, 'فشل عملية التعديل');
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const teammate = await db.teammates.findOne({
            where: {
                id: teammateId
            },
        });
        const response = new Response(true, 'تم تعديل بيانات عضو الفريق بنجاح', teammate);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// get teammates.
const getTeammates = async (req, res) => {
    const teammates = await db.teammates.findAll({
        order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع اعضاء الفريق', teammates);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// delete teammate.
const deleteTeammate = async (req, res) => {
    const teammate = await db.teammates.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!teammate) {
        const response = new Response(false, 'عضو الفريق غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
        deleteFile('teammates', teammate.image, async () => {
            await db.teammates.destroy({
                where: {
                    id: req.params.id,
                },
            });
            const response = new Response(true, 'تم حذف عضو الفريق بنجاح');
            return res.status(StatusCodes.OK).json(response.toJson());
        }, (error) => {
            console.log(error);
            const response = new Response(false, 'حدث خطأ اثناء حذف الملف');
            return res.status(StatusCodes.OK).json(response.toJson());
        });
}


module.exports = {
    getTeammates,
    createTeammate,
    editTeammate,
    deleteTeammate
}