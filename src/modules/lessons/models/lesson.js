
const Lessons = (sequelize, DataTypes) => sequelize.define('lessons', {
    title: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    video: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    resource: {
        type: DataTypes.STRING,
    },
},);

module.exports = Lessons;