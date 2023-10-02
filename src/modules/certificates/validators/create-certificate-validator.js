const Joi = require('joi');

const createCertificateValidator = (dto) => {
    const schema = Joi.object().keys({
        userId: Joi.number().required(),
        courseId: Joi.number().required(),
        levelId: Joi.number().required(),
    });
   return schema.validate(dto).error;
}

module.exports = createCertificateValidator;