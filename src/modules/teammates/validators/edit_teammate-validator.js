const Joi = require('joi');

const editTeammateValidator = (dto) => {
    const schema = Joi.object().keys({
        name: Joi.string().optional(),
        description: Joi.string().optional(),
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

module.exports = editTeammateValidator;