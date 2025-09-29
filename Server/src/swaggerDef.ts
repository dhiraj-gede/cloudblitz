import dotenv from 'dotenv';
dotenv.config();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CloudBlitz API',
    version: '1.0.0',
    description: 'API documentation for CloudBlitz server.',
  },
  servers: [
    {
      url:
        process.env.SWAGGER_SERVER_URL ||
        `https://bcdf5c3739e4.ngrok-free.app/api`,
    },
  ],
  components: {
    schemas: {
      RegisterRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'John Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'Password123!',
          },
        },
        required: ['name', 'email', 'password'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'Password123!',
          },
        },
        required: ['email', 'password'],
      },
      RefreshTokenRequest: {
        type: 'object',
        properties: {
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
        required: ['refreshToken'],
      },
      ForgotPasswordRequest: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
        },
        required: ['email'],
      },
      ResetPasswordRequest: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'reset-token-value' },
          newPassword: {
            type: 'string',
            format: 'password',
            example: 'NewPassword123!',
          },
        },
        required: ['token', 'newPassword'],
      },
      ChangePasswordRequest: {
        type: 'object',
        properties: {
          oldPassword: {
            type: 'string',
            format: 'password',
            example: 'OldPassword123!',
          },
          newPassword: {
            type: 'string',
            format: 'password',
            example: 'NewPassword123!',
          },
        },
        required: ['oldPassword', 'newPassword'],
      },
      AuthResponse: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
      CreateEnquiryRequest: {
        type: 'object',
        properties: {
          customerName: { type: 'string', example: 'Jane Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com',
          },
          phone: { type: 'string', example: '+1234567890' },
          message: { type: 'string', example: 'I need help with my order.' },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            example: 'medium',
          },
        },
        required: ['customerName', 'email', 'phone', 'message'],
      },
      UpdateEnquiryRequest: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['new', 'in-progress', 'closed'],
            example: 'in-progress',
          },
          priority: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
            example: 'high',
          },
          assignedTo: { type: 'string', example: 'userId123' },
          notes: {
            type: 'array',
            items: { type: 'string' },
            example: ['Followed up', 'Waiting for response'],
          },
        },
      },
      EnquiryResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          customerName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          message: { type: 'string' },
          status: { type: 'string' },
          priority: { type: 'string' },
          assignedTo: { type: 'string', nullable: true },
          createdBy: { type: 'string', nullable: true },
          notes: { type: 'array', items: { type: 'string' } },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      EnquiryListResponse: {
        type: 'array',
        items: { $ref: '#/components/schemas/EnquiryResponse' },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Jane Doe' },
          email: {
            type: 'string',
            format: 'email',
            example: 'jane@example.com',
          },
          role: {
            type: 'string',
            enum: ['admin', 'staff', 'user'],
            example: 'user',
          },
          isActive: { type: 'boolean', example: true },
          hasSeenTutorial: { type: 'boolean', example: false },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string' },
          isActive: { type: 'boolean' },
          hasSeenTutorial: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      UserListResponse: {
        type: 'array',
        items: { $ref: '#/components/schemas/UserResponse' },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export default swaggerDefinition;
