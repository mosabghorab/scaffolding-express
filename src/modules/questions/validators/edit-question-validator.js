const Joi = require('joi');

const editQuestionValidator = (dto) => {
    const schema = Joi.object().keys({
        question: Joi.string().optional(),
        options: Joi.string().optional(),
        type: Joi.string().valid('before','after').optional(),
        correctAnswer: Joi.string().optional(),
    });
    return schema.validate(dto).error;
}

module.exports = editQuestionValidator;