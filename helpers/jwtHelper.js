const JWT = require('jsonwebtoken');
const createError = require('http-errors');

// const User = require('../models/usermodel')

module.exports = {
    signAccessToken: (UserId) => {
        return new Promise((resolve, reject) => {
            const payload = { UserId };
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: '10m',
                issuer: 'EddTechnologies.com',
                audience: UserId.toString(),
            };
    
            JWT.sign(payload, secret, options, (error, token) => {
                if (error) {
                    console.log(error.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(createError.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' '); // Fixed splitting by space to get Bearer and token
        const token = bearerToken[1];
        
        if (!token) return next(createError.Unauthorized()); // Check if token is present

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') { // Fixed JWT error name
                    return next(createError.Unauthorized());
                } else {
                    return next(createError.Unauthorized(err.message));
                }
            }
            req.payload = payload;
            next();
        });
    },

    signRefreshToken: (UserId) => {
        return new Promise((resolve, reject) => {
            const payload = {};
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: '1y',
                issuer: 'EddTechnologies.com', // Fixed typo "issurer" -> "issuer"
                audience: UserId.toString(),
            };

            JWT.sign(payload, secret, options, (error, token) => {
                if (error) {
                    console.log(error.message);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });
    },

    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (err) return reject(createError.Unauthorized());
                
                const UserId = payload.aud;
                resolve(UserId.toString());
            });
        });
    },
};
