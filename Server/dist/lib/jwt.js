"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jwt = __importStar(require("jsonwebtoken"));
/**
 * Generate an access token
 * @param user User for whom to generate token
 * @returns Access token data
 */
const generateAccessToken = (user) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const expiresIn = parseInt(process.env.JWT_ACCESS_EXPIRES || '3600', 10); // 1 hour default
    const token = jwt.sign({ userId: user.id }, secret, {
        expiresIn,
    });
    return {
        token,
        expiresIn,
    };
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generate a refresh token
 * @param user User for whom to generate token
 * @returns Refresh token data
 */
const generateRefreshToken = (user) => {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    const expiresIn = parseInt(process.env.JWT_REFRESH_EXPIRES || '604800', 10); // 7 days default
    const token = jwt.sign({ userId: user.id }, secret, {
        expiresIn,
    });
    return {
        token,
        expiresIn,
    };
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verify access token
 * @param token The JWT token to verify
 * @returns The decoded token payload or null if invalid
 */
const verifyAccessToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined in environment variables');
            return null;
        }
        const decoded = jwt.verify(token, secret);
        return decoded;
    }
    catch {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verify refresh token
 * @param token The refresh token to verify
 * @returns The decoded token payload or null if invalid
 */
const verifyRefreshToken = (token) => {
    try {
        const secret = process.env.JWT_REFRESH_SECRET;
        if (!secret) {
            console.error('JWT_REFRESH_SECRET is not defined in environment variables');
            return null;
        }
        const decoded = jwt.verify(token, secret);
        return decoded;
    }
    catch {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
