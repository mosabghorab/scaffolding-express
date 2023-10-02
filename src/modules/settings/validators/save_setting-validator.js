const Joi = require('joi');

const saveSettingValidator = (dto) => {
    const schema = Joi.object().keys({
        key: Joi.string().required(),
        value: Joi.string().required(),
        group: Joi.string().required(),
        status: Joi.bool().required(),
    });
   return schema.validate(dto).error;
}

module.exports = saveSettingValidator;