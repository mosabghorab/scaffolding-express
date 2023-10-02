const Joi = require('joi');

const createCourseValidator = (dto) => {
    const schema = Joi.object().keys({
        userId: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        image :Joi.object({
            name: Joi.string().required(),
            data: Joi.binary().required(),
            size: Joi.number().max(5 * 1024 * 1024).required(), // 5 mb
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg', 'image/png' , 'image/jpg').required(),
          }).unknown(true).required(),
    });
    return schema.validate(dto).error;
}

module.exports = createCourseValidator;