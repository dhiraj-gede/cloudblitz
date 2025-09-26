"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const User_1 = require("../models/User");
const jwt_1 = require("../lib/jwt");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            res.status(401).json({
                status: 'error',
                message: 'Access denied. No token provided.'
            });
            return;
        }
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({
                status: 'error',
                message: 'Access denied. Invalid token format.'
            });
            return;
        }
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        if (!decoded) {
            res.status(401).json({
                status: 'error',
                message: 'Access denied. Invalid token.'
            });
            return;
        }
        const user = await User_1.User.findById(decoded.userId).select('+password');
        if (!user || !user.isActive) {
            res.status(401).json({
                status: 'error',
                message: 'Access denied. User not found or inactive.'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server error during authentication.',
            error: process.env.NODE_ENV !== 'production' ? String(error) : undefined
        });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Access denied. User not authenticated.'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                status: 'error',
                message: 'Access denied. Insufficient permissions.'
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
