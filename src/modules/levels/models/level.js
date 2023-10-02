
const Levels = (sequelize, DataTypes) => sequelize.define('levels', {
    title: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    levelNumber: {
        type: DataTypes.INTEGER,
        allowNull: false, 
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
},);

module.exports = Levels;