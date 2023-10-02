
const Settings = (sequelize, DataTypes) => sequelize.define('settings', {
    key: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false, 
    },
    group: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false,
    },
},);

module.exports = Settings;