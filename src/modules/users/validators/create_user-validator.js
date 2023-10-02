const Joi = require('joi');

const createUserValidator = (dto) => {
    const schema = Joi.object().keys({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        address: Joi.string().required(),
        educationalLevel: Joi.string().valid('fresh','primary', 'middle' ,'university').required(),
        // dateOfBirth: Joi.date().required(),
        password: Joi.string().required().min(8),
        role: Joi.string().valid('student').required(),
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

module.exports = createUserValidator;