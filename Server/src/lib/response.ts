import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export class ResponseHelper {
  static success<T>(res: Response, data?: T, message?: string, statusCode: number = 200): void {
    const response: ApiResponse<T> = {
      status: 'success',
      message,
      data
    };
    
    res.status(statusCode).json(response);
  }

  static created<T>(res: Response, data?: T, message?: string): void {
    this.success(res, data, message || 'Resource created successfully', 201);
  }

  static error(res: Response, message: string, statusCode: number = 400): void {
    const response: ApiResponse = {
      status: 'error',
      message
    };
    
    res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response, 
    data: T[], 
    page: number, 
    limit: number, 
    total: number, 
    message?: string
  ): void {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse<T[]> = {
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

  static notFound(res: Response, message: string = 'Resource not found'): void {
    this.error(res, message, 404);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized access'): void {
    this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden access'): void {
    this.error(res, message, 403);
  }

  static badRequest(res: Response, message: string = 'Bad request'): void {
    this.error(res, message, 400);
  }

  static conflict(res: Response, message: string = 'Resource already exists'): void {
    this.error(res, message, 409);
  }

  static internalError(res: Response, message: string = 'Internal server error'): void {
    this.error(res, message, 500);
  }
}