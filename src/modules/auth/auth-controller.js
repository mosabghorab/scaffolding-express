const db = require('../../server');
const Response = require('../../config/utils/response');
const StatusCodes = require('http-status-codes');
const { registerValidator, loginValidator, forgotPasswordValidator, verifyCodeValidator } = require('./validators');
const JwtService = require('../../services/jwt-service');
const { sendEmail } = require('../../services/email-sender');
const bcrypt = require('bcryptjs');


// register.
const register = async (req, res) => {
    let dto = {
        username: req.body.username,
        email: req.body.email,
        educationalLevel: req.body.educationalLevel,
        address: req.body.address,
        // dateOfBirth: req.body.dateOfBirth,
        password: req.body.password,
        role: 'student',
        type:'accountVerification',
    }
    // auto validators.
    const result = registerValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const userEmailIsExist = await db.users.findOne({
        where: {
            email: dto.email
        }
    });
    if (userEmailIsExist) {
        const response = new Response(false, 'البريد الالكتروني مستخدم مسبقاً');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const user = await db.users.create(dto);
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    await db.verificationCodes.create({
        email: user.email,
        code: code,
        type: dto.type,
    });
    sendEmail(user.email, 'Verification Code', `This is your verification code ${code}`);
    const response = new Response(true, 'لقد قمنا بارسال كود تحقق الى بريدك الالكتروني');
    return res.status(StatusCodes.OK).json(response.toJson());
}

// login.
const login = async (req, res) => {
    let dto = {
        email: req.body.email,
        password: req.body.password,
        type:'accountVerification',
    }
    // auto validators.
    const result = loginValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    // manual validators (if password is correct).
    const user = await db.users.findOne({
        where: {
            email: dto.email
        }
    });
    if (!user) {
        const response = new Response(false, 'البريد الكتروني او كلمة المرور غير صحيحة');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
        const response = new Response(false, 'البريد الكتروني او كلمة المرور غير صحيحة');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    if (!user.isActive) {
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        await db.verificationCodes.create({
            email: user.email,
            code: code,
            type: dto.type,
        });
        sendEmail(user.email, 'Verification Code', `This is your verification code ${code}`);
        const response = new Response(true, 'لقد قمنا بارسال كود تحقق الى بريدك الالكتروني');
        return res.status(StatusCodes.OK).json(response.toJson());
    } else {
        const token = JwtService.createJWT(user.id,user.role);
        user.setDataValue('token', token);
        user.setDataValue('password', undefined);
        const response = new Response(true, 'لقد سجلت دخولك بنجاح', user);
        return res.status(StatusCodes.OK).json(response.toJson());
    }

}

// send verification code.
const sendVerificationCode = async (req, res) => {
    let dto = {
        email: req.body.email,
        type: req.body.type,
    }
    // auto validators.
    const result = forgotPasswordValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    // manual validators.
    const user = await db.users.findOne({
        where: {
            email: dto.email
        }
    });
    if (!user) {
        const response = new Response(false, 'البريد الكتروني غير متوفر');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    if (!user.isActive) {
        const response = new Response(false, 'هذا الحساب غير مفعل');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    await db.verificationCodes.create({
        email: user.email,
        code: code,
        type: dto.type,
    });
    sendEmail(user.email, 'Verification Code', `This is your verification code ${code}`);
    const response = new Response(true, 'لقد قمنا بارسال كود تحقق الى بريدك الالكتروني');
    return res.status(StatusCodes.OK).json(response.toJson());
}

// verify code.
const verifyCode = async (req, res) => {
    let dto = {
        email: req.body.email,
        code: req.body.code,
        type: req.body.type,
    }
    // auto validators.
    const result = verifyCodeValidator(dto);
    if (result) {
        const response = new Response(false, result.details[0].message);
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    // manual validators.
    var user = await db.users.findOne({
        where: {
            email: dto.email
        }
    });
    if (!user) {
        const response = new Response(false, 'البريد الكتروني غير متوفر');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    const verificatioCode = await db.verificationCodes.findOne({
        where: {
            email: user.email,
            type: dto.type,
        }, order: [['createdAt', 'DESC']]
    });
    console.log(verificatioCode);
    console.log(dto.code);
    if (!verificatioCode || verificatioCode.code != dto.code) {
        const response = new Response(false, 'الكود المرسل خاطئ');
        return res.status(StatusCodes.OK).json(response.toJson());
    }
    if(dto.type === 'accountVerification'){
        await db.users.update({
            isActive: true
        }, {
            where: {
                email: dto.email
            }
        });
        user = await db.users.findOne({
            where: {
                email: dto.email
            }
        });
    }
    const token = JwtService.createJWT(user.id);
    user.setDataValue('token', token);
    user.setDataValue('password', undefined);
    const response = new Response(true, 'تم التحقق بنجاح', user);
    return res.status(StatusCodes.OK).json(response.toJson());
}


module.exports = {
    register,
    login,
    sendVerificationCode,
    verifyCode,
}