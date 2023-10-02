const Joi = require('joi');

const editLessonValidator = (dto) => {
    const schema = Joi.object().keys({
        title: Joi.string().optional(),
        description: Joi.string().optional(),
        video :Joi.object({
            name: Joi.string().required(),
            data: Joi.binary().required(),
            size: Joi.number().max(250 * 1024 * 1024).required(), // 250 mb
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-ms-wmv', 'video/x-msvideo', 'video/x-flv', 'video/webm').required(),
          }).unknown(true).optional(),
           // resource: Joi.string().required(),
    });
    return schema.validate(dto).error;
}

module.exports = editLessonValidator;