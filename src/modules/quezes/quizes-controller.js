const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { createQuizValidator } = require("./validators");


// save quiz.
const saveQuiz = async (req, res) => {
    let dto = {
        userId: req.userId,
        courseId: req.body.courseId,
        levelId: req.body.levelId,
        mark: req.body.mark,
        questionsCount: req.body.questionsCount,
        type: req.body.type,
    }
    // auto validators.
    const result = createQuizValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const quiz = await db.quizes.findOne({
        where: {
            userId: dto.userId,
            courseId: dto.courseId,
            levelId: dto.levelId,
            type: dto.type,
        }
    });
    if (quiz) {
        await db.quizes.update({
            mark: dto.mark
        }, {
            where: {
                id: quiz.id,
            }
        });
        const response = new Response(true, 'تم تعديل الاختبار بنجاح');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const q = await db.quizes.create(dto);
    const response = new Response(true, 'تم حفظ الاختبار بنجاح',q);
    return res.status(StatusCodes.OK).json(response.toJson());
}


// get saved quizes.
const getSavedQuizes = async (req, res) => {
    const quizes = await db.quizes.findAll({
        where: {
            userId: req.userId,
            levelId: req.query.levelId,
        },
        order: [['createdAt', 'DESC']],
    });
    const response = new Response(true, 'جميع الاختبارات المحفوظة للطالب في هذا المستوى', quizes);
    return res.status(StatusCodes.OK).json(response.toJson());
}


module.exports = {
    saveQuiz,
    getSavedQuizes,
}