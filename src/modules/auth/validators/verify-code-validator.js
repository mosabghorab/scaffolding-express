const Joi = require('joi');

const verifyCodeValidator = (dto) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        code: Joi.string().required().length(5),
        type: Joi.string().valid('forgotPassword','accountVerification').required(),
    });
   return schema.validate(dto).error;
}

module.exports = verifyCodeValidator;