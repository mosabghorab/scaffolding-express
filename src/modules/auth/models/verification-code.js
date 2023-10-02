
const VerificaionCodes = (sequelize, DataTypes) => sequelize.define('verification_codes', {
    code: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
    },
    type: {
        type: DataTypes.ENUM('forgotPassword', 'accountVerification'),
        allowNull: false, 
    },
},);

module.exports = VerificaionCodes;