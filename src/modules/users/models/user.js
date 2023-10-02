const bcrypt = require('bcryptjs');

const Users = (sequelize, DataTypes) => sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false, 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, 
        set(value) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('password', hash);
        },
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    educationalLevel: {
        type: DataTypes.ENUM('fresh','primary', 'middle' ,'university'),
        allowNull: false, 
    },
    dateOfBirth: {
        type: DataTypes.DATE,
    },
    image: {
        type: DataTypes.TEXT,
    },
    role: {
        type: DataTypes.ENUM('admin', 'student'),
        allowNull: false, 
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false, 
    },
},);

module.exports = Users;