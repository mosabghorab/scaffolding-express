
const Questions = (sequelize, DataTypes) => sequelize.define('questions', {
    question: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    options: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    type: {
        type: DataTypes.ENUM('before', 'after'),
        allowNull: false, 
    },
    correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
},);

module.exports = Questions;