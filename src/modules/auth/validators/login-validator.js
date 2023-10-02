const Joi = require('joi');
const Response = require('../../../config/utils/response');
const StatusCodes = require("http-status-codes");

const loginValidator = (dto) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8),
        type: Joi.string().valid('accountVerification').required(),
    });
   return schema.validate(dto).error;
}

module.exports = loginValidator;