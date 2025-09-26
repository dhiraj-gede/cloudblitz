"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static success(res, data, message, statusCode = 200) {
        const response = {
            status: 'success',
            message,
            data
        };
        res.status(statusCode).json(response);
    }
    static created(res, data, message) {
        this.success(res, data, message || 'Resource created successfully', 201);
    }
    static error(res, message, statusCode = 400) {
        const response = {
            status: 'error',
            message
        };
        res.status(statusCode).json(response);
    }
    static paginated(res, data, page, limit, total, message) {
        const totalPages = Math.ceil(total / limit);
        const response = {
            status: 'success',
            message: message || 'Data retrieved successfully',
            data,
            meta: {
                page,
                limit,
                total,
                totalPages
            }
        };
        res.status(200).json(response);
    }
    static notFound(res, message = 'Resource not found') {
        this.error(res, message, 404);
    }
    static unauthorized(res, message = 'Unauthorized access') {
        this.error(res, message, 401);
    }
    static forbidden(res, message = 'Forbidden access') {
        this.error(res, message, 403);
    }
    static badRequest(res, message = 'Bad request') {
        this.error(res, message, 400);
    }
    static conflict(res, message = 'Resource already exists') {
        this.error(res, message, 409);
    }
    static internalError(res, message = 'Internal server error') {
        this.error(res, message, 500);
    }
}
exports.ResponseHelper = ResponseHelper;
