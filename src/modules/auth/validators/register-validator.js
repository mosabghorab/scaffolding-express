const Joi = require('joi');
const Response = require("../../../config/utils/response");
const StatusCodes = require("http-status-codes");

const registerValidator = (dto) => {
    const schema = Joi.object().keys({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        educationalLevel: Joi.string().valid('fresh','primary', 'middle' ,'university').required(),
        address: Joi.string().required(),
        // dateOfBirth: Joi.date().required(),
        password: Joi.string().required().min(8),
        role: Joi.string().valid('student').required(),
        type: Joi.string().valid('accountVerification').required(),
    });
   return schema.validate(dto).error;
}

module.exports = registerValidator;