"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse({
                ...req.body,
                ...req.query,
                ...req.params
            });
            // Replace req.body with validated data
            req.body = validatedData;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: errorMessages
                });
                return;
            }
            res.status(500).json({
                status: 'error',
                message: 'Validation error'
            });
        }
    };
};
exports.validate = validate;
