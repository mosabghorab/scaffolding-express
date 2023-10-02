const Joi = require('joi');

const userJoinToCourseValidator = (dto) => {
    const schema = Joi.object().keys({
        userId: Joi.number().required(),
        courseId: Joi.number().required(),
    });
   return schema.validate(dto).error;
}

module.exports = userJoinToCourseValidator;