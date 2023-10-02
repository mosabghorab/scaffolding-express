const Joi = require('joi');

const createQuestionValidator = (dto) => {
    const schema = Joi.object().keys({
        levelId: Joi.number().required(),
        question: Joi.string().required(),
        options: Joi.string().required(),
        type: Joi.string().valid('before','after').required(),
        correctAnswer: Joi.string().required(),
    });
    return schema.validate(dto).error;
}

module.exports = createQuestionValidator;