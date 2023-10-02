const {Sequelize, DataTypes} = require('sequelize');
const dbConfig = require('./config/db/db-config');
const db = {}


// DB.
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operationsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        },
    },);


db.datatypes = DataTypes;
db.sequelize = sequelize;

db.users = require('./modules/users/models/user')(sequelize, DataTypes);
db.courses = require('./modules/courses/models/course')(sequelize, DataTypes);
db.levels = require('./modules/levels/models/level')(sequelize, DataTypes);
db.lessons = require('./modules/lessons/models/lesson')(sequelize, DataTypes);
db.questions = require('./modules/questions/models/question')(sequelize, DataTypes);
// db.answers = require('./modules/answers/models/answer')(sequelize, DataTypes);
db.verificationCodes = require('./modules/auth/models/verification-code')(sequelize, DataTypes);
db.usersCourses = require('./modules/users-courses/models/user-course')(sequelize, DataTypes);
db.quizes = require('./modules/quezes/models/quiz')(sequelize, DataTypes);
db.certificates = require('./modules/certificates/models/certificate')(sequelize, DataTypes);
db.certificateTemplates = require('./modules/certificate-templates/models/certificate-template')(sequelize, DataTypes);
db.teammates = require('./modules/teammates/models/teammate')(sequelize, DataTypes);
db.donators = require('./modules/donators/models/donator')(sequelize, DataTypes);
db.settings = require('./modules/settings/models/setting')(sequelize, DataTypes);

// relationships.
db.courses.belongsTo(db.users, {
    foreignKey: "userId",
    onDelete: 'CASCADE',
});

db.levels.belongsTo(db.courses, {
    foreignKey: "courseId",
    onDelete: 'CASCADE',
});

db.lessons.belongsTo(db.levels, {
    foreignKey: "levelId",
    onDelete: 'CASCADE',
});

db.questions.belongsTo(db.levels, {
    foreignKey: "levelId",
    onDelete: 'CASCADE',
});

// db.answers.belongsTo(db.questions, {
//     foreignKey: "questionId",
// });
// db.answers.belongsTo(db.users, {
//     foreignKey: "userId",
// });

db.courses.belongsToMany(db.users, {through: db.usersCourses, onDelete: 'CASCADE',});
db.users.belongsToMany(db.courses, {through: db.usersCourses, onDelete: 'CASCADE',});
db.usersCourses.belongsTo(db.users, {onDelete: 'CASCADE',});
db.usersCourses.belongsTo(db.courses, {onDelete: 'CASCADE',});

db.quizes.belongsTo(db.users, {
    foreignKey: "userId",
    onDelete: 'CASCADE',
});
db.quizes.belongsTo(db.courses, {
    foreignKey: "courseId",
    onDelete: 'CASCADE',
});
db.quizes.belongsTo(db.levels, {
    foreignKey: "levelId",
    onDelete: 'CASCADE',
});

db.certificates.belongsTo(db.users, {
    foreignKey: "userId",
    onDelete: 'CASCADE',
});
db.certificates.belongsTo(db.courses, {
    foreignKey: "courseId",
    onDelete: 'CASCADE',
});
db.certificates.belongsTo(db.levels, {
    foreignKey: "levelId",
    onDelete: 'CASCADE',
});

try {
    sequelize.sync({alter: false, force: false}).then(() => {
        console.log('My sql connection has been established successfully.');
    });
} catch (error) {
    console.log(error);
}

module.exports = db;
