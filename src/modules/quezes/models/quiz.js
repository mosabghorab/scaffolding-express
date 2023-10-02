
const Quiz = (sequelize, DataTypes) => sequelize.define('quizes',{
    mark:{
        type: DataTypes.FLOAT,
        allowNull: false, 
    },
    questionsCount:{
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    type: {
        type: DataTypes.ENUM('before', 'after'),
        allowNull: false, 
    },
});

module.exports = Quiz;