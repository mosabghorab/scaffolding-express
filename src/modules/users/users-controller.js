const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { createUserValidator, editUserValidator } = require("./validators");
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');


// create user.
const createUser = async (req, res) => {
    let dto = {
        username: req.body.username,
        email: req.body.email,
        address: req.body.address,
        educationalLevel: req.body.educationalLevel,
        // dateOfBirth: req.body.dateOfBirth,
        password: req.body.password,
        role: 'student',
        isActive: req.body.isActive,
        image: req.files?.image,
    }
    // auto validators.
    const result = createUserValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const userEmailIsExist = await db.users.findOne({
        where: {
            email: dto.email
        }
    });
    if (userEmailIsExist) {
        const response = new Response(false, 'البريد الالكتروني مستخدم مسبقاً');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    if (dto.image) {
        const image = dto.image;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'user-' + uniqueSuffix + '.' +image.name.split('.')[1];
        uploadFile(`users/${filename}`, image.data, async (url) => {
            console.log('file uploaded successfully');
            const user = await db.users.create({
                username: dto.username,
                email: dto.email,
                address: dto.address,
                educationalLevel: dto.educationalLevel,
                // dateOfBirth: dto.dateOfBirth,
                password: dto.password,
                role: dto.role,
                isActive: dto.isActive,
                image: url,
            });
            user.setDataValue('password', undefined);
            const response = new Response(true, 'تم انشاء الطالب بنجاح', user);
            return res.status(StatusCodes.OK).json(response.toJson());
        }, () => {
            console.log('failed to upload the file');
            const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
            return res.status(StatusCodes.OK).json(response.toJson());
        });
    } else {
        const user = await db.users.create(dto);
        user.setDataValue('password', undefined);
        const response = new Response(true, 'تم اضافة الطالب بنجاح', user);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// edit user.
const editUser = async (req, res) => {
    const userId = req.params.id;
    if (req.files && req.files.image) {
        let dto = {
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            educationalLevel: req.body.educationalLevel,
            password: req.body.password,
            // dateOfBirth: req.body.dateOfBirth,
            isActive: req.body.isActive,
            image: req.files?.image,
        }
        // auto validators.
        const result = editUserValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const userToUpdate = await db.users.findOne({
            where: {
                id: userId,
            },
        });
        const image = dto.image;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'user-' + uniqueSuffix + '.' +image.name.split('.')[1];
        if (userToUpdate.image) {
            // delete old image.
            deleteFile('users', userToUpdate.image, () => {
                // upload new image.
                uploadFile(`users/${filename}`, image.data, async (url) => {
                    console.log('file uploaded successfully');
                    // edit user in db.
                    const editResult = await db.users.update({
                        username: dto.username,
                        email: dto.email,
                        address: dto.address,
                        educationalLevel: dto.educationalLevel,
                        password: dto.password,
                        // dateOfBirth: dto.dateOfBirth,
                        isActive: dto.isActive,
                        image: url,
                    }, {
                        where: {
                            id: userId,
                        },
                    });
                    if (editResult == 0) {
                        const response = new Response(false, 'فشل عملية التعديل');
                        return res.status(StatusCodes.OK).json(response.toJson());
                    }
                    const user = await db.users.findOne({
                        where: {
                            id: userId
                        }, attributes: { exclude: ['password'] }
                    });
                    const response = new Response(true, 'تم تعديل بيانات الطالب بنجاح', user);
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
                    email: dto.email,
                    educationalLevel: dto.educationalLevel,
                    address: dto.address,
                    password: dto.password,
                    // dateOfBirth: dto.dateOfBirth,
                    isActive: dto.isActive,
                    image: url,
                }, {
                    where: {
                        id: userId,
                    },
                });
                if (editResult == 0) {
                    const response = new Response(false, 'فشل عملية التعديل');
                    return res.status(StatusCodes.OK).json(response.toJson());
                }
                const user = await db.users.findOne({
                    where: {
                        id: userId
                    }, attributes: { exclude: ['password'] }
                });
                const response = new Response(true, 'تم تعديل بيانات الطالب بنجاح', user);
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
            email: req.body.email,
            educationalLevel: req.body.educationalLevel,
            address: req.body.address,
            password: req.body.password,
            // dateOfBirth: req.body.dateOfBirth,
            isActive: req.body.isActive,
        }
        // auto validators.
        const result = editUserValidator(dto);
        if (result) {
            const response = new Response(false, result.details[0].message);
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const editResult = await db.users.update(dto, {
            where: {
                id: userId,
            },
        });
        if (editResult == 0) {
            const response = new Response(false, 'فشل عملية التعديل');
            return res.status(StatusCodes.OK).json(response.toJson());
        }
        const user = await db.users.findOne({
            where: {
                id: userId
            }, attributes: { exclude: ['password'] }
        });
        const response = new Response(true, 'تم تعديل بيانات الطالب بنجاح', user);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
}

// get users.
const getUsers = async (req, res) => {
    const users = await db.users.findAll({
        where: {
            role: 'student',
        },
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع الطلاب', users);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// delete user.
const deleteUser = async (req, res) => {
    const user = await db.users.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!user || user.role === "admin") {
        const response = new Response(false, 'الطالب غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    if (user.image) {
        deleteFile('users', user.image, async () => {
            await db.users.destroy({
                where: {
                    id: req.params.id,
                },
            });
            const response = new Response(true, 'تم حذف الطالب بنجاح');
            return res.status(StatusCodes.OK).json(response.toJson());
        }, (error) => {
            console.log(error);
            const response = new Response(false, 'حدث خطأ اثناء حذف الملف');
            return res.status(StatusCodes.OK).json(response.toJson());
        });
    } else {
        await db.users.destroy({
            where: {
                id: req.params.id,
            },
        });
        const response = new Response(true, 'تم حذف الطالب بنجاح');
        return res.status(StatusCodes.OK).json(response.toJson());
    }

}


module.exports = {
    getUsers,
    createUser,
    editUser,
    deleteUser
}