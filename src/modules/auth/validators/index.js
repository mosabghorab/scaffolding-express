const registerValidator = require('./register-validator');
const loginValidator = require('./login-validator');
const forgotPasswordValidator = require('./forgot-password-validator');
const verifyCodeValidator = require('./verify-code-validator');

module.exports = {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    verifyCodeValidator,
};
