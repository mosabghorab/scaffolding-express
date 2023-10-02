const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { createQuestionValidator, editQuestionValidator } = require("./validators");


// create question.
const createQuestion = async (req, res) => {
    let dto = {
        levelId: req.body.levelId,
        question: req.body.question,
        options: req.body.options,
        correctAnswer: req.body.correctAnswer,
        type: req.body.type,
    }
    // auto validators.
    const result = createQuestionValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const question = await db.questions.create(dto);
    const response = new Response(true, 'تم انشاء السؤال بنجاح', question);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// edit question.
const editQuestion = async (req, res) => {
    const questionId = req.params.id;
    let dto = {
        question: req.body.question,
        options: req.body.options,
        type: req.body.type,
        correctAnswer: req.body.correctAnswer,
    }
    // auto validators.
    const result = editQuestionValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const editResult = await db.questions.update(dto, {
        where: {
            id: questionId,
        },
    });
    if (editResult == 0) {
        const response = new Response(false, 'فشل عملية التعديل');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const question = await db.questions.findOne({
        where: {
            id: questionId
        }
    });
    const response = new Response(true, 'تم تعديل السؤال بنجاح', question);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// get questions.
const getQuestions = async (req, res) => {
    const { type, levelId } = req.query;
    const where = { levelId };
    if (type) {
      where.type = type;
    }
    const questions = await db.questions.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع الأسئلة', questions);
    return res.status(StatusCodes.OK).json(response.toJson());
}

// delete question.
const deleteQuestion = async (req, res) => {
    const question = await db.questions.findOne({
        where: {
            id: req.params.id,
        }
    });
    if (!question) {
        const response = new Response(false, 'الدرس غير موجود');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    await db.questions.destroy({
        where: {
            id: req.params.id,
        },
    });
    const response = new Response(true, 'تم حذف الدرس بنجاح');
    return res.status(StatusCodes.OK).json(response.toJson());
}


module.exports = {
    getQuestions,
    createQuestion,
    editQuestion,
    deleteQuestion
}