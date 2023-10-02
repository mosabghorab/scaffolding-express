// const db = require('../../server');
// const Response = require('../../config/utils/response');
// const Question = require('../../modules/questions/models/question');
// const Users = require('../users/models/user');
// const StatusCodes = require('http-status-codes');
// const { createAnswerValidator } = require("./validators");


// // create answer.
// const createAnswer = async (req, res) => {
//     let dto = {
//         userId: req.userId,
//         questionId: req.body.questionId,
//         isCorrect: req.body.isCorrect,
//     }
//     // auto validators.
//     const result = createAnswerValidator(dto);
//     if (result) {
//         const response = new Response(false, result.details[0].message);
//         return res.status(StatusCodes.OK,).json(response.toJson());
//     }
//     const answer = await db.answers.create(dto);
//     const response = new Response(true,'تم انشاء الاجابة بنجاح', answer);
//     return res.status(StatusCodes.OK).json(response.toJson());
// }

// // get answers.
// const getAnswers = async (req, res) => {
//     const answers = await db.answers.findAll({
//         include: [{
//             model: db.questions, where: {
//                 type: req.query.type,
//                 levelId: req.query.levelId,
//             }
//         }]
//     });
//     const response = new Response(true,'جميع الاجابات', answers);
//     return res.status(StatusCodes.OK).json(response.toJson());
// }


// module.exports = {
//     getAnswers,
//     createAnswer,
// }