
const Teammates = (sequelize, DataTypes) => sequelize.define('teammates', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
},);

module.exports = Teammates;