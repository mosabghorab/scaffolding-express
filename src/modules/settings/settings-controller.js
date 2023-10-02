const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { saveSettingValidator } = require("./validators");
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');


// save setting.
const saveSetting = async (req, res) => {
    let dto = {
        key: req.body.key,
        value: req.body.value,
        group: req.body.group,
        status: req.body.status,
    }
    // auto validators.
    const result = saveSettingValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const setting = await db.settings.findOne({
        where: {
            key: dto.key,
        }
    });
    if (!setting) {
        // create setting.
        const setting = await db.settings.create(dto);
        const response = new Response(true, 'تم انشاء الاعداد بنجاح');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    // update setting.
    await db.settings.update(dto, {
        where: {
            key: dto.key,
        }
    });
    const response = new Response(true, 'تم تعديل الاعداد بنجاح');
    return res.status(StatusCodes.OK).json(response.toJson());
}

// get setting.
const getSetting = async (req, res) => {
    const {key} = req.query;
    if(!key){
        const response = new Response(false, 'مفتاح الاعداد مطلوب');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const setting = await db.settings.findOne({
        where: {
            key: key,
        }
    });
    if (!setting) {
        const response = new Response(false, 'الاعداد غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const response = new Response(true, 'الاعداد', setting);
    return res.status(StatusCodes.OK).json(response.toJson());
}



module.exports = {
    saveSetting,
    getSetting,
}