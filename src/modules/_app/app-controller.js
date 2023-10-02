const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');

// get statistics.
const getStatistics = async (req, res) => {
    const lastStudents = await db.users.findAll({
        order: [['id', 'DESC']],
        limit: 3,
        where: {
            role: 'student',
        },
        attributes: { exclude: ['password'] },
    });
    const studentsCount = await db.users.count({
        where: {
            role: 'student',
        }
    });
    const lastCourses = await db.courses.findAll({
        order: [['id', 'DESC']],
        limit: 3,
    });
    const coursesCount = await db.courses.count();
    const lastCertificates = await db.certificates.findAll({
        order: [['id', 'DESC']],
        limit: 3,
        include: [{
            model: db.users,
            attributes: { exclude: ['password'] },
        },
        {
            model: db.courses,
        },
        {
            model: db.levels,
        },
        ]
    });
    const certificatesCount = await db.certificates.count();
    var beforeQuiziesRatio = 0;
    var afterQuiziesRatio = 0;
    var calculatedQuizesIds = [];
    const quizes = await db.quizes.findAll();
    quizes.forEach(element => {
        const newQuizes = quizes.filter(quiz => element.levelId === quiz.levelId && element.userId === quiz.userId && calculatedQuizesIds.filter(q=>q.id === element.id ).length === 0);
        if (newQuizes.length === 2) {
            const beforeQuiz = newQuizes.filter(quiz => quiz.type === 'before')[0];
            const afterQuiz = newQuizes.filter(quiz => quiz.type === 'after')[0];
            if ((afterQuiz.mark * 100) / afterQuiz.questionsCount >= 70) {
                const beforeQuizRatio = (beforeQuiz.mark * 100) / beforeQuiz.questionsCount
                beforeQuiziesRatio += beforeQuizRatio;
                const afterQuizRatio = (afterQuiz.mark * 100) / afterQuiz.questionsCount
                afterQuiziesRatio += afterQuizRatio;
                calculatedQuizesIds.push(beforeQuiz.id);
                calculatedQuizesIds.push(afterQuiz.id);
            }
        }
    });
    const finalBeforeQuizesRatio = (beforeQuiziesRatio / (calculatedQuizesIds.length/2)) || 0;
    const finalAfterQuizesRatio = (afterQuiziesRatio /  (calculatedQuizesIds.length/2)) || 0;
    const progressRatio = finalAfterQuizesRatio - finalBeforeQuizesRatio;
    const statistics = {
        'beforeQuizesRatio': finalBeforeQuizesRatio.toFixed(1),
        'afterQuizesRatio': finalAfterQuizesRatio.toFixed(1),
        'progressRatio': progressRatio.toFixed(1),
        'studentsCount': studentsCount,
        'coursesCount': coursesCount,
        'certificatesCount': certificatesCount,
        'lastStudents': lastStudents,
        'lastCourses': lastCourses,
        'lastCertificates': lastCertificates,
    }
    const response = new Response(true, 'احصائيات', statistics);
    return res.status(StatusCodes.OK).json(response.toJson());
}


module.exports = {
    getStatistics,
}