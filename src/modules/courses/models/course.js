
const Courses = (sequelize, DataTypes) => sequelize.define('courses', {
    title: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
},);

module.exports = Courses;