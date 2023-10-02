const Joi = require('joi');

const forgotPasswordValidator = (dto) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        type: Joi.string().valid('forgotPassword','accountVerification').required(),
    });
   return schema.validate(dto).error;
}

module.exports = forgotPasswordValidator;