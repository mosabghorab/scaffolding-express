
const Donators = (sequelize, DataTypes) => sequelize.define('donators', {
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

module.exports = Donators;