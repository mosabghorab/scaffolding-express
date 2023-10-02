const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { createCertificateValidator } = require("./validators");


// save certificate.
const saveCertificate = async (req, res) => {
    let dto = {
        userId: req.userId,
        courseId: req.body.courseId,
        levelId: req.body.levelId,
    }
    // auto validators.
    const result = createCertificateValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const certificate = await db.certificates.findOrCreate({
        where: {
            userId: dto.userId,
            courseId: dto.courseId,
            levelId: dto.levelId,
        },
    });
    const response = new Response(true, 'تم حفظ الشهادة بنجاح',certificate[0]);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// get saved certificates.
const getSavedCertificates = async (req, res) => {
    const certificates = await db.certificates.findAll({
        order: [['createdAt', 'DESC']],
        include: [{
            model: db.users,
            attributes: { exclude: ['password'] },
        },
        {
            model: db.courses,
        },
        {
            model: db.levels,
        },
        ]
    });
    const response = new Response(true, 'جميع الشهادات المحفوظة', certificates);
    return res.status(StatusCodes.OK).json(response.toJson());
}


module.exports = {
    saveCertificate,
    getSavedCertificates,
}