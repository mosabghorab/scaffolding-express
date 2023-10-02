const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { createDonatorValidator, editDonatorValidator } = require("./validators");
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');


// create donator.
const createDonator = async (req, res) => {
    let dto = {
        name: req.body.name,
        description: req.body.description,
        image: req.files?.image,
    }
    // auto validators.
    const result = createDonatorValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    if (dto.image) {
        const image = dto.image;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'donator-' + uniqueSuffix + '.' + image.name.split('.')[1];
        uploadFile(`donators/${filename}`, image.data, async (url) => {
            console.log('file uploaded successfully');
            const donator = await db.donators.create({
                name: dto.name,
                description: dto.description,
                image: url,
            });
            const response = new Response(true, 'تم انشاء الداعم بنجاح', donator);
            return res.status(StatusCodes.OK).json(response.toJson());
        }, () => {
            console.log('failed to upload the file');
            const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
            return res.status(StatusCodes.OK).json(response.toJson());
        });
    } else {
        const donator = await db.donators.create(dto);
        const response = new Response(true, 'تم اضافة عضو فريق بنجاح', donator);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// edit donator.
const editDonator = async (req, res) => {
    const donatorId = req.params.id;
    if (req.files && req.files.image) {
        let dto = {
            name: req.body.name,
            description: req.body.description,
            image: req.files.image,
        }
        // auto validators.
        const result = editDonatorValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const donatorToUpdate = await db.donators.findOne({
            where: {
                id: donatorId,
            },
        });
        const image = dto.image;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'donator-' + uniqueSuffix + '.' + image.name.split('.')[1];
        // delete old image.
        deleteFile('donators', donatorToUpdate.image, () => {
            // upload new image.
            uploadFile(`donators/${filename}`, image.data, async (url) => {
                console.log('file uploaded successfully');
                // edit donator in db.
                const editResult = await db.donators.update({
                    name: dto.name,
                    description: dto.description,
                    image: url,
                }, {
                    where: {
                        id: donatorId,
                    },
                });
                if (editResult == 0) {
                    const response = new Response(false, 'فشل عملية التعديل');
                    return res.status(StatusCodes.OK).json(response.toJson());
                }
                const donator = await db.donators.findOne({
                    where: {
                        id: donatorId
                    },
                });
                const response = new Response(true, 'تم تعديل بيانات الداعم بنجاح', donator);
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
        const result = editDonatorValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const editResult = await db.donators.update(dto, {
            where: {
                id: donatorId,
            },
        });
        if (editResult == 0) {
            const response = new Response(false, 'فشل عملية التعديل');
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const donator = await db.donators.findOne({
            where: {
                id: donatorId
            },
        });
        const response = new Response(true, 'تم تعديل بيانات الداعم بنجاح', donator);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// get donators.
const getDonators = async (req, res) => {
    const donators = await db.donators.findAll({
        order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع الداعمين', donators);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// delete donator.
const deleteDonator = async (req, res) => {
    const donator = await db.donators.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!donator) {
        const response = new Response(false, 'الداعم غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
        deleteFile('donators', donator.image, async () => {
            await db.donators.destroy({
                where: {
                    id: req.params.id,
                },
            });
            const response = new Response(true, 'تم حذف الداعم بنجاح');
            return res.status(StatusCodes.OK).json(response.toJson());
        }, (error) => {
            console.log(error);
            const response = new Response(false, 'حدث خطأ اثناء حذف الملف');
            return res.status(StatusCodes.OK).json(response.toJson());
        });
}


module.exports = {
    getDonators,
    createDonator,
    editDonator,
    deleteDonator
}