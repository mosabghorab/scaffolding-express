const jwt = require('jsonwebtoken');

class JwtService {
    static createJWT = (userId,role) => {
        return jwt.sign({userId: userId,role:role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
    }
}

module.exports = JwtService;