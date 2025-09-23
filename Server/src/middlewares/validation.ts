import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params
      });
      
      // Replace req.body with validated data
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
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