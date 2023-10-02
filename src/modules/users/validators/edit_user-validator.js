const Joi = require('joi');

const editUserValidator = (dto) => {
    const schema = Joi.object().keys({
        username: Joi.string().optional(),
        email: Joi.string().email().optional(),
        address: Joi.string().optional(),
        educationalLevel: Joi.string().valid('fresh','primary', 'middle' ,'university').optional(),
        password: Joi.string().optional().min(8),
        // dateOfBirth: Joi.date().optional(),
        isActive: Joi.bool().optional(),
        image :Joi.object({
            name: Joi.string().required(),
            data: Joi.binary().required(),
            size: Joi.number().max(5 * 1024 * 1024).required(), // 5 mb
            encoding: Joi.string().required(),
            mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
          }).unknown(true).optional(),
    });
   return schema.validate(dto).error;
}

module.exports = editUserValidator;