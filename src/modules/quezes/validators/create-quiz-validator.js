const Joi = require('joi');

const createQuizValidator = (dto) => {
    const schema = Joi.object().keys({
        userId: Joi.number().required(),
        courseId: Joi.number().required(),
        levelId: Joi.number().required(),
        mark: Joi.number().required(),
        questionsCount: Joi.number().required(),
        type: Joi.string().valid('before','after').required(),
    });
   return schema.validate(dto).error;
}

module.exports = createQuizValidator;