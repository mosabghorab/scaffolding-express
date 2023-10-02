const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { editProfileValidator } = require('./validators');
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');


// edit.
const edit = async (req, res) => {
    if (req.files && req.files.image) {
        let dto = {
            username: req.body.username,
            password: req.body.password,
            address: req.body.address,
            dateOfBirth: req.body.dateOfBirth,
            image: req.files?.image,
        }
        // auto validators.
        const result = editProfileValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const profileToUpdate = await db.users.findOne({
            where: {
                id: req.userId,
            },
        });
        const image = dto.image;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'user-' + uniqueSuffix + '.' +image.name.split('.')[1];
        if (profileToUpdate.image) {
            // delete old image.
            deleteFile('users', profileToUpdate.image, () => {
                // upload new image.
                uploadFile(`users/${filename}`, image.data, async (url) => {
                    console.log('file uploaded successfully');
                    // edit user in db.
                    const editResult = await db.users.update({
                        username: dto.username,
                        password: dto.password,
                        address: dto.address,
                        dateOfBirth: dto.dateOfBirth,
                        image: url,
                    }, {
                        where: {
                            id: req.userId,
                        },
                    });
                    if (editResult == 0) {
                        const response = new Response(false, 'فشل عملية التعديل');
                        return res.status(StatusCodes.OK).json(response.toJson());
                    }
                    const user = await db.users.findOne({
                        where: {
                            id: req.userId
                        }, attributes: { exclude: ['password'] }
                    });
                    const response = new Response(true, 'تم تعديل البيانات بنجاح', user);
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
            // upload image.
            uploadFile(`users/${filename}`, image.data, async (url) => {
                console.log('file uploaded successfully');
                // edit user in db.
                const editResult = await db.users.update({
                    username: dto.username,
                    password: dto.password,
                    address: dto.address,
                    dateOfBirth: dto.dateOfBirth,
                    image: url,
                }, {
                    where: {
                        id: req.userId,
                    },
                });
                if (editResult == 0) {
                    const response = new Response(false, 'فشل عملية التعديل');
                    return res.status(StatusCodes.OK).json(response.toJson());
                }
                const user = await db.users.findOne({
                    where: {
                        id: req.userId
                    }, attributes: { exclude: ['password'] }
                });
                const response = new Response(true, 'تم تعديل البيانات بنجاح', user);
                return res.status(StatusCodes.OK).json(response.toJson());
            }, () => {
                console.log('failed to upload the file');
                const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
                return res.status(StatusCodes.OK).json(response.toJson());
            });
        }
    } else {
        let dto = {
            username: req.body.username,
            password: req.body.password,
            address: req.body.address,
            dateOfBirth: req.body.dateOfBirth,
        }
        // auto validators.
        const result = editProfileValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const editResult = await db.users.update(dto, {
            where: {
                id: req.userId,
            },
        });
        if (editResult == 0) {
            const response = new Response(false, 'فشل عملية التعديل');
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const user = await db.users.findOne({
            where: {
                id: req.userId
            }, attributes: { exclude: ['password'] }
        });
        const response = new Response(true, 'تم تعديل البيانات بنجاح', user);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// my.
const my = async (req, res) => {
    const user = await db.users.findOne({
        where: {
            id: req.userId
        }, attributes: { exclude: ['password'] }
    });
    const response = new Response(true, 'الملف الشخصي', user);
    return res.status(StatusCodes.OK).json(response.toJson());
}


module.exports = {
    edit,
    my,
}