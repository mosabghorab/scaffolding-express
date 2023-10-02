// const User = require('../old/models/user');
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require('../config/errors');

const userMiddleware = async (req, res, next) => {
    // check header.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        req.role = payload.role;
        next();
    } catch (e) {
        throw new UnauthorizedError('Authentication invalid');
    }
}

const adminMiddleware = async (req, res, next) => {
    // check header.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role !== 'admin') {
            throw new UnauthorizedError('You do not have permission to do this action.');
        }
        req.userId = payload.userId;
        req.role = payload.role;
        next();
    } catch (e) {
        throw new UnauthorizedError('Authentication invalid');
    }
}

const authIfExistMiddleware = async (req, res, next) => {
    // check header.
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        next();
        return;
    }
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    req.role = payload.role;
    next();
}

module.exports = { userMiddleware, adminMiddleware, authIfExistMiddleware };