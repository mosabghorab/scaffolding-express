const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { uploadFile, deleteFile } = require('../../services/firebase/firebase-storage');
const { saveCertificateTemplateValidator} = require("./validators");



// save certificate template.
const saveCertificateTemplate = async (req, res) => {
    let dto = {
        image: req.files?.image,
    }
    // auto validators.
    const result = saveCertificateTemplateValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const certificateTemplate = await db.certificateTemplates.findOne({ where: {} });
    if (certificateTemplate) {
        deleteFile('certificate_templates', certificateTemplate.image, () => {
            // upload new image.
            const image = dto.image;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = 'certificate_template-' + uniqueSuffix + '.' +image.name.split('.')[1];
            uploadFile(`certificate_templates/${filename}`, image.data, async (url) => {
                console.log('file uploaded successfully');
                // edit course in db.
                const editResult = await db.certificateTemplates.update({
                    image: url,
                }, { where: {} });
                if (editResult == 0) {
                    const response = new Response(false, 'فشل عملية التعديل');
                    return res.status(StatusCodes.OK).json(response.toJson());
                }
                const certificateTemplate = await db.certificateTemplates.findOne({ where: {} });
                const response = new Response(true, 'تم تعديل قالب الشهادة بنجاح', certificateTemplate);
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
        const image = dto.image;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'certificate_template-' + uniqueSuffix+ '.' +image.name.split('.')[1];
        uploadFile(`certificate_templates/${filename}`, image.data, async (url) => {
            console.log('file uploaded successfully');
            const certificateTemplate = await db.certificateTemplates.create({
                image: url,
            });
            const response = new Response(true, 'تم انشاء قالب الشهادة بنجاح', certificateTemplate);
            return res.status(StatusCodes.OK).json(response.toJson());
        }, () => {
            console.log('failed to upload the file');
            const response = new Response(false, 'حدث خطأ ما اثناء رفع الملف');
            return res.status(StatusCodes.OK).json(response.toJson());
        });
    }
}

// get certificate template.
const getCertificateTemplate = async (req, res) => {
    const certificateTemplate = await db.certificateTemplates.findOne({ where: {} });
    const response = new Response(true, 'قالب الشهادة', certificateTemplate);
    return res.status(StatusCodes.OK).json(response.toJson());
}


module.exports = {
    getCertificateTemplate,
    saveCertificateTemplate,
}